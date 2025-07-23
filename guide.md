# Refactoring Guide: Supporting Multi-Leg Duties in Duty Cards

## 1. Background
Currently, the `Duty` type represents a single flight (leg) per day. To support duty cards with multiple legs per card/day, the `Duty` type and related logic must be refactored so that each duty contains an array of flights.

## 2. Current Structure
- `Duty` is defined in both `/lib/types.ts` as:
  ```ts
  interface Duty {
    id: string;
    flightNumber: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    departureLocation: string;
    arrivalLocation: string;
    user?: User;
  }
  ```
- `DutyCard` and `DutyColumn` components expect a single flight per duty.
- Swap logic, roster parsing, and API endpoints all assume a one-leg-per-duty structure.

## 3. Proposed Structure
- **New `Duty` type:**
  ```ts
  interface FlightLeg {
    id: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    departureLocation: string;
    arrivalLocation: string;
    isDeadhead: bool;
  }

  interface Duty {
    id: string;
    date: string;
    legs: FlightLeg[];
    user?: User;
    pairing: string | null; // string is common UUID for all duties in a pairing
  }
  ```
- All references to `flightNumber`, `departureTime`, etc. on `Duty` should be replaced with references to the `legs` array.

## 4. Refactor Steps
### a. Update Types
- Update `Duty` and introduce `FlightLeg` in `/lib/types.ts` and anywhere else `Duty` is defined.
- Update all props and usages in components (`DutyCard`, `DutyColumn`, etc.) to use the new structure.

## 5. Duty Pairing: User-Driven Grouping of Duties

To allow users to pair/group multiple duties together (e.g., for swaps or operational reasons), consider the following approach:

### a. Data Model
- Introduce a `pairingId` (string or UUID) property on the `Duty` type. Duties with the same `pairingId` are considered paired/grouped.

- Store the relationship in your backend (DB: add a `pairingId` column or a join table).

### b. UI/UX
- DutyModal: 
    - Allow users to select multiple duties (e.g., via checkboxes or multi-select UI).
    - Provide an action/button to "Pair" selected duties together.
    - Allow users to unpair or edit pairings as needed.
- Visually indicate paired/grouped duties in the DutyModal and Roster page
    - Create a Small visible line at the bottom of the duties overlaying all duties of a pairing.

    
### c. Logic/Functions
- Function to create a new pairing:
  ```ts
  function pairDuties(duties: Duty[]): DutyPairing {
    const pairingId = generateUUID();
    return {
      id: pairingId,
      duties: duties.map(duty => ({ ...duty, pairingId }))
    };
  }
  ```
- Function to add/remove duties from an existing pairing.
- Update swap logic to treat paired duties as a single swap package if needed.

### d. Backend/API
- Update backend endpoints to support creating, updating, and retrieving pairings.
- Ensure atomicity: when swapping or modifying a pairing, all duties in the group are handled together.

### e. Example Usage
- User selects two or more duty cards and clicks "Pair Duties".
- The app generates a `pairingId` and updates the selected duties.
- UI shows the duties as grouped/linked.
- When swapping, all paired duties are swapped together.

---

This approach provides flexibility for pairing any combination of duties and supports complex operational or swap requirements.

## Step-by-Step Migration Workflow for Multi-Leg Duties and Pairing

1. **Update Type Definitions**
   - Refactor the `Duty` type to include a `legs: FlightLeg[]` property and a `pairingId` (or create a `DutyPairing` type).
   - Update all TypeScript interfaces and types in `/lib/types.ts` and other relevant files.

2. **Database Migration**
   - Update your database schema:
     - Add a `pairingId` column to the `Duty` table (nullable).
     - Create a new table for `FlightLeg` if not embedding legs directly in Duty.
     - Migrate existing duty records: convert single-leg duties into a `legs` array.
     - If needed, create a `duty_pairings` table to group duties.
   - Write and run migration scripts to adjust existing data.

3. **Backend/API Refactor**
   - Update backend logic to handle the new structure:
     - Adjust API endpoints to accept and return duties with multiple legs.
     - Update endpoints to support pairing/grouping duties (add, remove, fetch pairings).
     - Ensure swap logic can handle paired/grouped duties as a package.

4. **Frontend Refactor**
   - Refactor all components that use `Duty`:
     - Update `DutyCard`, `DutyColumn`, and any duty-related modals to map over and display `legs`.
     - Update UI to allow users to select and pair duties (checkboxes, multi-select, "Pair Duties" button, etc.).
     - Visually indicate paired/grouped duties in the UI.
   - Refactor forms and modals for duty creation/editing to support multiple legs and pairing.

5. **Roster Parsing & Seeding**
   - Update the roster parser (e.g., `/lib/roster/parser.ts`) to generate duties with multiple legs and assign pairings if needed.
   - Update seed scripts to create multi-leg duties and example pairings.

6. **Testing**
   - Write/adjust unit and integration tests for:
     - Duty creation, editing, and display with multiple legs.
     - Pairing/grouping and unpairing duties.
     - Swapping paired/grouped duties.
   - Manually verify all UI flows.

7. **Data Migration (Production)**
   - Back up your production data.
   - Run migration scripts and verify data integrity.
   - Test all critical flows in a staging environment before deploying to production.

8. **Deployment & User Communication**
   - Deploy changes to production.
   - Communicate new features and changes to users (release notes, tooltips, or guides).

---

**Tip:** Tackle the migration in a feature branch and merge only after all steps are complete and tested.
### b. Update Components
- **DutyCard:** Render all legs for a given duty (e.g., map over `duty.legs`).
- **DutyColumn:** Pass and expect the new structure from parent components.
- **SwapRequestModal** and swap-related pages: update to show all legs in a duty.

### c. Update Data Flow
- Update roster parsing logic (`/lib/roster/parser.ts`) to group multiple legs into a single duty per day.
- Update backend/API to support storing and retrieving multiple legs per duty.

### d. Migration
- If using a database, update schema and migration scripts to support multiple legs per duty.
- Provide a migration script to convert existing single-leg duties to the new format.

## 5. Example Usage
```tsx
// Rendering a duty card with multiple legs
function DutyCard({ duty }: { duty: Duty }) {
  return (
    <Card>
      <CardHeader>
        <div>{duty.date}</div>
      </CardHeader>
      <CardContent>
        {duty.legs.map((leg) => (
          <div key={leg.id}>
            <div>{leg.flightNumber}: {leg.departureLocation} → {leg.arrivalLocation}</div>
            <div>{leg.departureTime} - {leg.arrivalTime}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

## 6. Affected Files
- `/lib/types.ts`
- `/components/dashboard/duty-card.tsx`
- `/components/dashboard/duty-column.tsx`
- `/components/dashboard/swap-request-modal.tsx`
- `/app/roster/page.tsx`
- `/app/swap-requests/page.tsx`
- `/lib/roster/parser.ts`
- Backend API routes involving duties

## 7. Testing
- Add/adjust tests to verify multiple legs per duty are displayed and handled correctly.
- Test swap and roster features for multi-leg duties.

---

**Summary:**
This refactor will allow each duty card to represent multiple flight legs per day. All data structures, UI components, and backend logic must be updated accordingly. See above for a step-by-step migration plan.
