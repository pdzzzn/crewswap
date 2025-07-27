# In-Depth Database Migration Guide: Multi-Leg Duties & Pairing

This guide provides a step-by-step approach to migrate your database schema and data to support the new `Duty` and `FlightLeg` structure, including pairing/grouping of duties.

---

## 1. Analyze Current Schema
- Review the current `Duty` table structure. It likely contains columns for each flight property (flightNumber, departureTime, etc.).
- Identify all references to duty-related tables in your codebase and migrations.

## 2. Design the New Schema
- **Duty Table**
  - Remove single-leg columns (flightNumber, departureTime, etc.) from `Duty`.
  - Add a `pairing` column (nullable string/UUID) to group duties.
  - Retain `id`, `date`, `userId`, etc.
- **FlightLeg Table**
  - Create a new `FlightLeg` table with:
    - `id` (PK, UUID or auto-increment)
    - `dutyId` (FK to Duty)
    - `flightNumber`, `departureTime`, `arrivalTime`, `departureLocation`, `arrivalLocation`, `isDeadhead`
- **Migration Example (Prisma)**
  ```prisma
  model Duty {
    id        String   @id @default(uuid())
    date      DateTime
    userId    String?
    pairing   String?
    legs      FlightLeg[]
    // ...other fields
  }

  model FlightLeg {
    id                String   @id @default(uuid())
    dutyId            String
    duty              Duty     @relation(fields: [dutyId], references: [id])
    flightNumber      String
    departureTime     DateTime
    arrivalTime       DateTime
    departureLocation String
    arrivalLocation   String
    isDeadhead        Boolean
  }
  ```
  - Adjust for your ORM (TypeORM, Sequelize, etc.) as needed.

## 3. Write Migration Scripts
- **Schema Migration**
  - Use your ORM's migration tool (e.g., Prisma Migrate, Sequelize CLI, Knex, etc.) to:
    - Create the `FlightLeg` table.
    - Add the `pairing` column to `Duty`.
    - Remove single-leg columns from `Duty`.
- **Data Migration**
  - For each existing Duty:
    - Create a corresponding `FlightLeg` record with the old flight data.
    - Assign the new `legs` relationship.
    - Set `pairing` to `null` (or migrate existing groupings if present).
  - Example (pseudo-code):
    ```js
    for (const duty of oldDuties) {
      const leg = {
        id: uuid(),
        dutyId: duty.id,
        flightNumber: duty.flightNumber,
        departureTime: duty.departureTime,
        arrivalTime: duty.arrivalTime,
        departureLocation: duty.departureLocation,
        arrivalLocation: duty.arrivalLocation,
        isDeadhead: false // or infer from data
      };
      insertIntoFlightLegs(leg);
    }
    ```

## 4. Update Seed & Test Data
- Refactor seed scripts to use the new schema.
- Seed example multi-leg duties and pairings.

## 5. Update Application Code
- Refactor backend logic to use the new schema (see `/lib/types.ts`).
- Update all queries, mutations, and API endpoints to work with `Duty` + `FlightLeg`.
- Update pairing logic to use the new `pairing` column.

## 6. Test Migration
- Write automated tests for migration correctness:
  - Verify all old duties have a corresponding leg.
  - Verify new duties can have multiple legs.
  - Verify pairing/grouping logic.
- Manually verify data in the DB after migration.

## 7. Production Migration Steps
- **Backup** your production database.
- Run schema migrations.
- Run data migration scripts.
- Test the migrated data in staging.
- Deploy application code changes.
- Monitor for issues post-deployment.

---

## Example Migration Workflow (Prisma)
1. Update your `schema.prisma` with the new models.
2. Run `npx prisma migrate dev --name multi-leg-duty` (or equivalent for your ORM).
3. Write a script to migrate old duty data into `FlightLeg`.
4. Test everything locally and in staging.
5. Deploy to production following the steps above.

---

**Tip:** Keep all migration scripts under version control and document any manual steps required.
