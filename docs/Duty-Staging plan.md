# Duty‑Staging Plan

Goal: After a user uploads a roster PDF, we convert it to ICS, parse it, and present a staging UI where the user can select which duties to upload. OFF and STANDBY are uploaded as duties; CHECKIN, CHECKOUT, PICKUP are not uploaded. Times are in UTC; OFF can be all‑day. Flight number formats are kept intact (e.g., "DH/EW 9575"). Dedup ensures a user cannot upload the same duty twice, but different users may upload the same duty.

---

## 1) Data Model Alignment

Source parser output (lib/ics.ts → parseIcsToDuties):
- Fields today: id, date (YYYY‑MM‑DD), flightNumber (includes STBY_Sx and plain text for non‑flights), departureTime (HH:mm or empty), arrivalTime (HH:mm or empty), departureLocation (IATA), arrivalLocation (IATA)
- All times are in UTC already (consumer must treat them as such). All‑day events (OFF) have blank times.

Target staging types (to be added in lib/types.ts):
- DutyType = 'FLIGHT' | 'DEADHEAD' | 'STANDBY' | 'OFF'
- StagedDutyLeg {
  - id: string  // stable staging id
  - date: string  // YYYY‑MM‑DD (UTC day of departure)
  - depTime?: string  // HH:mm (UTC)
  - arrTime?: string  // HH:mm (UTC)
  - dep: string  // IATA (no validation here)
  - arr: string  // IATA (no validation here)
  - code: string  // e.g., "EW 9500", "DH/EW 9575", "STBY_S3"
  - type: DutyType
  - notes?: string
  - raw?: { summary?: string; location?: string; description?: string }
}
- StagedDutyBlock {
  - id: string  // stable staging id for the block
  - startDate: string  // date of first leg (UTC)
  - endDate: string  // date of last leg (UTC)
  - type: DutyType  // OFF, STANDBY, or FLIGHT/DEADHEAD if flight legs exist
  - legs: StagedDutyLeg[]  // for OFF/STANDBY, legs will be a single item representing the day window
}

Classification rules:
- FLIGHT: summary matched as a flight and NOT starting with "DH/"
- DEADHEAD: code begins with "DH/" (e.g., "DH/EW 9575")
- STANDBY: dutyCode such as "STBY_Sx" results in code=that string; single leg
- OFF: "Off <IATA>" → single leg, all‑day; times empty

We keep code/flightNumber exactly as parsed (no normalization of carrier/number). All times are handled/displayed as UTC.

---

## 2) Grouping Into Duty Blocks (C/I → C/O)

Goal: Represent multiple flight legs as a single duty block when they belong together. Night flights may span dates.

Algorithm (client transform step):
1. Start with the ordered list of parsed events (sorted by DTSTART ascending; parser order generally preserves this).
2. Scan to detect blocks:
   - Begin a new block when encountering a CHECKIN (C/I) event. Accumulate subsequent flight/deadhead legs and other non‑upload events until a CHECKOUT (C/O) is hit; then close the block.
   - OFF and STANDBY form their own single‑item blocks, independent of C/I/C/O.
   - PICKUP is treated as non‑upload and does not form its own block; it may appear before C/I within the same day; include it in the block context but do not upload it.
3. Cross‑midnight: Leg dates/times remain UTC. A block’s startDate is the first leg’s date; endDate is the last leg’s date. The block still closes on the C/O encountered, regardless of date change.
4. Fallbacks when C/I or C/O is missing:
   - If flight/deadhead legs exist without surrounding C/I/C/O, group contiguous legs on the same UTC day into a block; close the block when an OFF/STANDBY or day boundary is encountered.
   - Log a warning in parsing/staging logs when expected C/I/C/O is missing.

Upload policy:
- Upload only the legs within blocks of type FLIGHT/DEADHEAD and standalone blocks OFF/STANDBY.
- Do NOT upload CHECKIN, CHECKOUT, PICKUP as separate duties.

---

## 3) Deduplication Strategy (Per User)

Constraint: A user must not upload the same duty twice (but different users can upload the same duty).

Proposed per‑leg uniqueness key (server‑side validation):
- user_id + date + depTime + arrTime + dep + arr + code

For OFF/STANDBY (single‑item blocks):
- user_id + date + code

Server import flow:
- For each selected leg/duty, check existence by the uniqueness key; skip duplicates and log dedup result per item.
- Treat a block import as a series of per‑leg upserts with deduplication.

---

## 4) API Contracts

Existing:
- POST /api/convert-roster → returns parsed ICS duties (array of parser items). The client will transform these into StagedDutyBlocks.

New:
- POST /api/duties/import (to implement)
  - Body: { blocks: StagedDutyBlock[], userId: string }
  - Behavior:
    - For each block, iterate legs to insert FLIGHT/DEADHEAD and OFF/STANDBY as duties.
    - Apply deduplication rules.
    - Attach notes (if provided) per leg.
    - Return summary: insertedCount, skippedDuplicates, errors[] (with per‑item detail).

- GET /api/admin/logs (implemented now)
  - Query params:
    - list=true → returns available log files with size and lastModified
    - file=<name>&limit=<N>&tail=true → returns last N lines or last N bytes from logs/<name>
  - To be consumed by app/admin/dashboard/page.tsx later.

---

## 5) UI/UX for duty‑staging‑modal

Inputs/State:
- Receives raw parser items and transforms them into StagedDutyBlocks via the grouping rules.
- Maintains selection state at leg level; provides group‑level select/deselect helpers.
- Editable field: notes (per leg or per block applied to all legs — choose per leg for precision).

Filters:
- OFF, DEADHEAD, FLIGHT, STANDBY checkboxes (multi‑select)
- Select all / select none
- Date range filter (optional; nice‑to‑have)

Presentation:
- Show blocks grouped by date with a clear C/I → C/O visual boundary when available.
- Legs inside a block are shown in order with times (UTC) and dep/arr.
- OFF/STANDBY appear as single‑item blocks.
- Unknowns: If dep/arr is "Unknown" or times are missing where expected, show a warning icon and tooltip. Selection is still allowed.

Confirmation:
- On submit, show a modal summarizing count by type and date range. Confirm sends POST /api/duties/import with selected items only.

---

## 6) Error Handling & Logging

Client:
- Display inline warnings for partially parsed items.
- Toast on network/API errors; show per‑item errors returned from import.

Server:
- Extend existing logToFile usage in parse & import flows.
- For import: log item decisions (inserted, duplicate‑skipped, error) with user id and the uniqueness key fields.
- Admin logs: use GET /api/admin/logs to inspect logs. Later, the dashboard page can render these and poll if needed.

---

## 7) Implementation Checklist

1) Types
- Add StagedDutyLeg and StagedDutyBlock to lib/types.ts; add DutyType union.

2) Client transform
- Create a helper (e.g., lib/staging.ts) to map parser output → StagedDutyBlocks, implementing classification and grouping rules (C/I → C/O, cross‑midnight handling, fallbacks).

3) UI
- Build components in components/roster/duty-staging-modal.tsx:
  - Render grouped blocks and leg rows (checkbox per leg)
  - Filters (OFF, DEADHEAD, FLIGHT, STANDBY) and Select all/none
  - Notes editor (per leg)
  - Confirmation modal on submit

4) API
- Implement POST /api/duties/import:
  - Validate payload, enforce UTC expectations
  - Dedup per rules, insert, and summarize results
  - Log outcomes via logToFile

5) Admin logs
- Wire app/admin/dashboard/page.tsx to GET /api/admin/logs with list and file content views.

6) Testing
- Unit: transform grouping, classification, and dedup logic
- Integration: end‑to‑end from parse → stage → import, including duplicates and OFF/STANDBY
- Real sample: use logs/ics-content-*.log with the CLI to validate transformations

---

## 8) Open Items / Assumptions
- Deadhead detection uses the "DH/" prefix in code. If there are other deadhead markers in DESCRIPTION, we can add a fallback rule.
- If C/I or C/O is missing, we group contiguous legs by UTC day; this is a heuristic. If you prefer different fallback grouping, specify the rule.
- If you want the server to also accept full blocks and auto‑split into legs, we can support both shapes.
