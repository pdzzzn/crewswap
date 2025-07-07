# Duty Pairing Structure Implementation Plan

This document outlines the necessary changes across the codebase to transition from a flat `Duty` structure to the new `DutyPairing` structure, which supports multiple legs and layovers.

---

### 1. Data Models and Types

The most critical changes start at the data layer. The database schema and TypeScript types must be updated first.

#### `prisma/schema.prisma` (Database Schema)

The database schema is the foundation. The current `Duty` model needs to be replaced with a relational structure for pairings and their legs.

**Changes Required:**

1.  **Remove `Duty` Model:** The existing `Duty` model should be removed.
2.  **Create `DutyPairing` Model:** This will be the top-level model for a trip.
    ```prisma
    model DutyPairing {
      id            String      @id @default(cuid())
      pairingId     String      @unique // e.g., "P456"
      startDate     DateTime
      endDate       DateTime
      totalDuration String?     // e.g., "48h 30m"
      userId        String
      user          User        @relation(fields: [userId], references: [id])
      legs          DutyLeg[]
      createdAt     DateTime    @default(now())
      updatedAt     DateTime    @updatedAt

      // For swap requests
      sentSwapRequests    SwapRequest[] @relation("SenderDuty")
      targetSwapRequests  SwapRequest[] @relation("TargetDuty")
    }
    ```
3.  **Create `DutyLeg` Model:** This model will store individual flights or layovers within a pairing. An `enum` for `LegType` will help differentiate them.
    ```prisma
    enum LegType {
      FLIGHT
      LAYOVER
    }

    model DutyLeg {
      id                String      @id @default(cuid())
      order             Int         // To maintain the order of legs in a pairing
      type              LegType
      
      pairingId         String
      pairing           DutyPairing @relation(fields: [pairingId], references: [id], onDelete: Cascade)

      // Flight-specific fields
      flightNumber      String?
      departureTime     DateTime?
      arrivalTime       DateTime?
      departureLocation String?     // 3-letter code
      arrivalLocation   String?     // 3-letter code

      // Layover-specific fields
      location          String?     // 3-letter code
      duration          String?     // e.g., "26h 0m"

      createdAt         DateTime    @default(now())
    }
    ```
4.  **Update `SwapRequest` Model:** The relations for duties must be updated to point to `DutyPairing`.
    ```prisma
    model SwapRequest {
      // ... other fields
      senderDutyId    String
      senderDuty      DutyPairing @relation("SenderDuty", fields: [senderDutyId], references: [id])
      targetDutyId    String
      targetDuty      DutyPairing @relation("TargetDuty", fields: [targetDutyId], references: [id])
    }
    ```

---

#### `/home/user/aviation-crew-swap/lib/types.ts`

The TypeScript types must be updated to mirror the new database structure.

**Changes Required:**

1.  **Replace `Duty` Interface:** The existing `Duty` interface should be replaced with new interfaces for `DutyPairing`, `DutyLeg`, and `Layover`.

    ```typescript
    // This is a good opportunity to define the new structure clearly.
    export interface FlightLeg {
      id: string;
      type: 'FLIGHT';
      flightNumber: string;
      date: string;
      departureTime: string;
      arrivalTime: string;
      departureLocation: string;
      arrivalLocation: string;
    }

    export interface Layover {
      id: string;
      type: 'LAYOVER';
      location: string;
      duration: string; // e.g., "26h 0m"
    }

    export type PairingLeg = FlightLeg | Layover;

    export interface DutyPairing {
      id: string;
      pairingId: string;
      startDate: string;
      endDate: string;
      totalDuration: string;
      legs: PairingLeg[];
      user?: User;
    }
    ```

---

### 2. Frontend Component Adjustments

#### `/home/user/aviation-crew-swap/components/roster/duty-staging-modal.tsx`

This component requires the most significant changes. It needs to be refactored from staging individual duties to building a complete `DutyPairing`.

**Changes Required:**

*   **Line 23: `stagedDuties` state:** Change `useState<Duty[]>` to `useState<DutyPairing | null>(null)` to build one pairing at a time.
*   **Line 26: `handleDeleteStagedDuty`:** This function will need to be changed to `handleDeleteLeg(legId: string)` to remove a leg from the `legs` array of the pairing being built.
*   **Line 30: `handleAddDuty`:** Rename this to `handleAddLeg`. It will now take the form data and add a new `FlightLeg` object to the `legs` array of the `DutyPairing` being constructed.
*   **Line 42: `handleSaveAll`:** This function will now send the fully constructed `DutyPairing` object to a new API endpoint for creation.
*   **Lines 53-64 (UI Rendering):** The JSX needs to be completely reworked. Instead of mapping `stagedDuties`, it should render the details of the single `DutyPairing` being built, and then map over its `legs` array to display each leg and layover.
*   **Line 69: "Add Single Duty" Button:** Rename this to "Add Flight Leg". You should also add a new button, "Add Layover", which would open a simpler form for layover details.

#### `/home/user/aviation-crew-swap/components/roster/add-duty-form.tsx`

This form will now be used to add a single *leg* to a pairing.

**Changes Required:**

*   **Component Purpose:** The component's purpose is now to add a `FlightLeg`. The `onDutyAdd` prop should be renamed to `onLegAdd`, and its type signature updated to reflect the leg data.
*   **Line 30: `onSubmit`:** The `onDutyAdd(values)` call should be changed to `onLegAdd(values)`.

#### `/home/user/aviation-crew-swap/app/swap-requests/page.tsx`

This page displays swap requests and must be updated to handle pairings.

**Changes Required:**

*   **Line 40: `SwapRequest` interface:** The `senderDuty` and `targetDuty` properties must be changed from the old `Duty` type to the new `DutyPairing` type.
*   **Lines 200-231: `SwapRequestCard` component:** The JSX for rendering flight details needs a major update. It should now display `DutyPairing` information (e.g., `pairingId`, start/end dates) and then map over `request.senderDuty.legs` and `request.targetDuty.legs` to render each flight and layover in the trip.

---

### 3. Backend API Adjustments

The API endpoints that handle duty and swap request logic must be updated to work with the new relational data structure.

**Changes Required:**

*   **`/api/duties` (or similar):**
    *   The `POST` endpoint for creating duties must be updated to accept a `DutyPairing` payload with nested `legs`. The controller logic will need to create the `DutyPairing` and all associated `DutyLeg` records in the database, preferably within a single transaction.
    *   The `GET` endpoint must be updated to fetch pairings and their related legs using Prisma's `include` option.
*   **`/api/swap-requests`:**
    *   The `GET` endpoint at `fetch('/api/swap-requests')` must be updated to include the full `DutyPairing` data (with legs) for both `senderDuty` and `targetDuty`. This will require a change in the Prisma query to `include` the nested relations for pairings and their legs.