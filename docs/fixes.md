# CrewSwap – Bugs & Issues Deep-Dive and Fix Roadmap

Scope: Focused expansion of the eight issues listed in opus.md (Potential Bugs & Issues). No code changes here—only analysis, risks, and an actionable plan.
Last updated: 2025-08-11

---

## 1) Auth profile creation race/consistency

What/Where
- New login path may fail to create a `users` profile row; the app falls back to an in-memory user.
- File: `contexts/AuthContext.tsx` (fetch→insert path, around profile bootstrap).

Why (likely root causes)
- RLS may block inserts with end-user token.
- No idempotency: plain insert (not upsert) + possible double-trigger from `getSession` and `onAuthStateChange`.
- Failures logged but not surfaced; user proceeds with partial state.

Impact
- Missing/partial profile → empty dashboards, broken joins on `user_id`.

Fix plan
- Prefer server-owned bootstrap API (service role) that upserts `users` row once per auth user (idempotent, normalized role/base).
- Or: strengthen client path with `upsert({ onConflict: 'id' })`, retry on 409, and RLS policy allowing self-insert/update: `id = auth.uid()`.
- Telemetry + user-facing error if bootstrap fails; no silent fallback.

Tests/Acceptance
- Brand-new user ends with a persisted profile within 1s.
- Concurrent logins produce exactly one row (no dupes).
- If blocked by RLS, UI shows an actionable message.

---

## 2) Missing error boundaries (route/global)

What/Where
- Uncaught client/runtime errors can blank an entire route.
- Affects pages: dashboard, roster, swap-requests, notifications.

Why
- No `error.tsx` per route; no `global-error.tsx`.

Impact
- UX instability; harder triage in prod.

Fix plan
- Add `global-error.tsx` and per-route `error.tsx`; pair with `loading.tsx` for clean state separation.
- Pipe errors to Sentry/monitoring; show retry actions.

Tests/Acceptance
- Forced errors render friendly fallbacks with reset; no blank screens.

---

## 3) Date/Time inconsistencies (UTC/local drift)

What/Where
- Queries and formatting mix UTC conversions and local `Date` objects.
- Example: dashboard uses `new Date().toISOString().split('T')[0]` to build a date filter; roster/swap-requests also mix local/UTC.

Why
- No explicit time policy; ICS inputs provide times without authoritative TZ.

Impact
- Off-by-one on boundaries; miscounted "upcoming"; roster misalignment across timezones.

Fix plan
- Adopt policy: store as UTC (`timestamptz`) and compute grouping dates in UTC server-side; display in user TZ.
- Replace all `toISOString().split('T')[0]` with helpers: `todayUtc()` or `todayIn(tz)`; centralize in `lib/datetime.ts`.
- Normalize ICS ingest: capture source TZ; convert to UTC on persistence; keep HH:mm local for display only.

Tests/Acceptance
- Snapshot tests for UTC-12/UTC+14 ensure correct “today/upcoming”.
- Visual roster aligns per local calendar day consistently.

---

## 4) Potential memory leaks in useEffect (async)

What/Where
- Effects kick async fetch; `setState` may run after unmount.
- Files: `app/dashboard/page.tsx`, `app/swap-requests/page.tsx`.

Why
- No `AbortController`/isMounted guard; rapid nav causes late updates.

Impact
- React warnings; wasted work; flaky UI.

Fix plan
- Introduce `useSafeAsync` helper (guards + abort) and apply to all data-fetching effects.
- Debounce re-fetch on auth changes; keep single in-flight per component.

Tests/Acceptance
- Navigating away mid-fetch produces no warnings; UI remains consistent.

---

## 5) Query safety around `.or(...)` string building

What/Where
- `swap-requests` uses template interpolation in `.or(\`sender_id.eq.${userId},receiver_id.eq.${userId}\`)`.

Why
- `.or` requires a string expression; interpolation is convenient but brittle.

Impact
- Low injection risk (userId from session), but robustness/escaping and future maintenance risk.

Fix plan
- Validate `userId` with a UUID guard before use.
- Prefer clearer alternatives: two queries unioned in code, or `or('sender_id.eq.' || userId || ',receiver_id.eq.' || userId)` with strict UUID validation; or RPC with parameters.
- Ensure RLS prevents cross-tenant leakage regardless of client filters.

Tests/Acceptance
- Malformed userId fails closed; policy tests prove isolation.

---

## 6) Missing/uneven loading states

What/Where
- Some actions/routes lack consistent spinners/skeletons (e.g., import flows, certain buttons).

Why
- Not all async paths surface `isLoading`.

Impact
- Perceived slowness; duplicate clicks.

Fix plan
- Add `loading.tsx` to data-heavy routes; standardize button-level loading props; optimistic UI + toasts for long ops.

Tests/Acceptance
- Throttled network still shows feedback within 150ms across routes/actions.

---

## 7) Unhandled promise rejections / weak user feedback

What/Where
- Some async paths log errors but don’t notify users (e.g., swap-requests fetch; mixed server/client auth login flow).

Why
- No central error→toast mapping; mixed return contracts.

Impact
- Silent failures; confused users.

Fix plan
- Create tiny `notifyError(err, context)` util and use everywhere; standardize action results to `{ ok, error? }`.
- Separate server login success vs client session sync; surface retry if client sync fails.

Tests/Acceptance
- Forced failures yield actionable toasts; no silent stalls.

---

## 8) Type safety gaps (any casts; snake/camel drift)

What/Where
- `swap-requests` maps `(request: any)`; ad-hoc casing transforms; mixed typing of Supabase client.

Why
- Not leveraging generated `Database` types throughout; no shared mappers.

Impact
- Schema drift goes unnoticed; runtime mapping bugs.

Fix plan
- Type Supabase clients (server/client) with `types/database.ts`.
- Add shared mappers (snake→camel) in `lib/mappers.ts`; unit-test them.
- ESLint: ban `any` in app code; enable `consistent-type-imports`.

Tests/Acceptance
- Type errors catch column drift; zero `any` in data layer.

---

## Cross-cutting hardening (brief)
- Real-time readiness: always clean up subscriptions; test reconnects.
- Observability: add Sentry for errors + trace slow queries.
- Security: verify RLS for `users`, `duties`, `swap_requests`, `notifications` by role/ownership.

---

## Concise implementation roadmap

Week 0 (prep)
- Add basic test harness (Vitest/Jest) and Sentry.

Sprint 1 – Stability
- Bug 1: Server bootstrap or RLS+upsert + retries + telemetry.
- Bug 2: Global/route error boundaries; add missing `loading.tsx`.
- Bug 7: Centralize error handling + user feedback.

Sprint 2 – Correctness & UX
- Bug 3: Timezone policy + helpers; refactor queries/formatting; normalize ICS ingest.
- Bug 4: `useSafeAsync` + abort/guards; remove warnings.
- Bug 6: Standardize loading states for actions and routes.

Sprint 3 – Safety & Type rigor
- Bug 5: Harden `.or(...)` usage + UUID validation + policy checks.
- Bug 8: Strong typing for Supabase clients; shared mappers; ESLint ban `any`.

Exit criteria
- No unhandled rejections/leaks; correct date logic across TZ; consistent loading UX; type-safe data layer; profile creation is reliable and idempotent.
