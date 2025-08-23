# Duty Swapping Implementation Guide

## Current State Analysis

### Existing Infrastructure
- **Database**: Well-structured with `swap_requests` table containing sender/receiver relationships, duty references, status tracking, and message fields
- **Components**: `SwapRequestModal` exists but is currently designed for single duty selection from a list
- **Pages**: Dedicated `/swap-requests` page for managing sent/received requests with approve/deny functionality
- **Authentication**: Supabase-based auth with RLS policies for secure access
- **Real-time**: Supabase client ready for real-time subscriptions

### Current Limitations
- Roster page displays duties but lacks selection mechanism
- SwapRequestModal triggered from individual DutyCard rather than bulk selection
- No visual feedback for selectable/selected states
- No date-based constraint validation

## Proposed Implementation Strategy

### 1. Selection Mechanism on Roster Page

#### State Management
```typescript
// Add to RosterPageClient component state
const [selectionMode, setSelectionMode] = useState<'idle' | 'selecting'>('idle');
const [selectedDuties, setSelectedDuties] = useState<Set<string>>(new Set());
const [highlightedOwnDuties, setHighlightedOwnDuties] = useState<Set<string>>(new Set());
```

#### Selection Rules
- **Activation**: Click on any "Available Swaps" duty card to enter selection mode
- **Multi-select**: Allow multiple duties from different users to be selected
- **Date Constraints**: 
  - When a duty is selected, automatically highlight user's duties on the same date
  - Prevent selection of duties that would create scheduling conflicts
- **Visual Feedback**:
  - Selected cards: Primary border color with subtle background tint
  - Highlightable own duties: Pulsing border animation
  - Non-selectable cards: Reduced opacity with cursor-not-allowed

#### Implementation Details
- Add `onClick` handler to duty cards in the "Available Swaps" section
- Track selected duty IDs in a Set for O(1) lookup performance
- Use `useMemo` to calculate which own duties should be highlighted based on selected dates
- Add keyboard support (Ctrl/Cmd+Click for multi-select, Escape to cancel)

### 2. Floating Action Button (FAB)

#### Design Specifications
```typescript
interface FABProps {
  selectedCount: number;
  onProceed: () => void;
  onClear: () => void;
  isVisible: boolean;
}
```

#### Positioning & Animation
- **Position**: Fixed bottom-right, 24px margin from edges
- **Animation**: Slide-up entrance with spring physics
- **Badge**: Show count of selected duties
- **Actions**: 
  - Primary: "Create Swap Request" - opens enhanced modal
  - Secondary: "Clear Selection" - resets all selections

### 3. Enhanced Swap Request Modal

#### New Modal Structure
```typescript
interface EnhancedSwapModalProps {
  selectedDuties: Duty[];  // Multiple selected duties
  userDuties: Duty[];      // User's duties for matching dates
  onSubmit: (swapRequests: SwapRequestData[]) => Promise<void>;
}
```

#### "I Give, You Get" Interface Design

##### Left Panel - "I Offer"
- Display user's duties that match selected duty dates
- Allow selection of which duties to offer in exchange
- Group by date for clarity
- Show duty details (flight numbers, times, locations)

##### Right Panel - "You Give"
- Display all selected duties from other users
- Group by user to show who owns what
- Automatic pairing suggestions based on dates
- Visual connection lines between paired duties

##### Bottom Section - Message & Actions
- Unified message field for all swap requests
- Option to send individual messages per request
- Batch submit for multiple swaps
- Preview of all swap combinations before submission

### 4. Smart Pairing Algorithm

```typescript
function suggestPairings(selectedDuties: Duty[], userDuties: Duty[]): SwapPairing[] {
  // Group duties by date
  const selectedByDate = groupBy(selectedDuties, d => d.date);
  const userByDate = groupBy(userDuties, d => d.date);
  
  // Find matching dates
  const pairings: SwapPairing[] = [];
  
  for (const [date, selected] of selectedByDate) {
    const userDutiesOnDate = userByDate.get(date) || [];
    
    if (userDutiesOnDate.length > 0) {
      // Direct date match - highest priority
      pairings.push({
        type: 'exact_match',
        selected,
        offered: userDutiesOnDate,
        score: 1.0
      });
    } else {
      // Look for nearby dates (±1 day)
      const nearbyDates = findNearbyDates(date, userByDate.keys());
      if (nearbyDates.length > 0) {
        pairings.push({
          type: 'nearby_match',
          selected,
          offered: nearbyDates.flatMap(d => userByDate.get(d)),
          score: 0.7
        });
      }
    }
  }
  
  return pairings.sort((a, b) => b.score - a.score);
}
```

### 5. Batch Swap Request Processing

#### Backend Considerations
```typescript
// New API endpoint for batch swap creation
POST /api/swap-requests/batch
{
  requests: [{
    senderDutyId: string,
    targetDutyId: string,
    receiverId: string,
    message?: string
  }],
  globalMessage?: string
}
```

#### Transaction Management
- Wrap all swap requests in a database transaction
- Create notifications for all receivers atomically
- Return detailed results for each request (success/failure)

### 6. Real-time Updates

#### Supabase Subscriptions
```typescript
useEffect(() => {
  const channel = supabase
    .channel('roster-updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'duties' },
      handleDutyChange
    )
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'swap_requests' },
      handleNewSwapRequest
    )
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
}, []);
```

### 7. Validation & Business Rules

#### Pre-submission Validation
- **Duty Ownership**: Verify selected duties still belong to target users
- **Date Conflicts**: Check for overlapping flight times
- **Pending Requests**: Warn if duties already have pending swaps
- **Role Compatibility**: Ensure role requirements are met

#### Conflict Resolution
```typescript
interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  errors: ValidationError[];
}

function validateSwapRequest(swap: SwapData): ValidationResult {
  const result = { isValid: true, warnings: [], errors: [] };
  
  // Check if duties are already in pending swaps
  if (hasPendingSwap(swap.senderDutyId)) {
    result.warnings.push({
      type: 'pending_swap',
      message: 'This duty already has a pending swap request'
    });
  }
  
  // Check role compatibility
  if (!areRolesCompatible(swap.senderRole, swap.targetRole)) {
    result.errors.push({
      type: 'role_mismatch',
      message: 'Role requirements not met for this swap'
    });
    result.isValid = false;
  }
  
  return result;
}
```

### 8. UX Enhancements

#### Visual Feedback
- **Loading States**: Skeleton cards during data fetch
- **Optimistic Updates**: Immediate UI updates before server confirmation
- **Error Recovery**: Graceful handling with retry options
- **Success Feedback**: Confetti animation on successful swap request

#### Accessibility
- ARIA labels for selection states
- Keyboard navigation support
- Screen reader announcements for state changes
- High contrast mode support

### 9. Mobile Responsiveness

#### Adaptive Layout
- **Small Screens**: Stack "I Give" and "You Get" panels vertically
- **Touch Gestures**: Long-press to select, swipe to clear
- **FAB Position**: Move to bottom-center on mobile to avoid thumb reach issues
- **Modal**: Full-screen on mobile with stepped wizard approach

### 10. Performance Optimizations

#### Data Management
- Virtualized scrolling for large duty lists
- Debounced selection updates
- Memoized duty grouping calculations
- Lazy loading of duty details

#### State Updates
```typescript
// Use reducer for complex state management
const [state, dispatch] = useReducer(swapReducer, initialState);

// Batch state updates
React.unstable_batchedUpdates(() => {
  setSelectedDuties(new Set());
  setSelectionMode('idle');
  setHighlightedOwnDuties(new Set());
});
```

## Implementation Phases

### Phase 1: Core Selection (Week 1)
- Implement selection state management
- Add click handlers to duty cards
- Create basic FAB component
- Add visual feedback for selected states

### Phase 2: Enhanced Modal (Week 1-2)
- Redesign SwapRequestModal for multi-selection
- Implement "I Give, You Get" interface
- Add pairing algorithm
- Create validation system

### Phase 3: Backend Integration (Week 2)
- Create batch swap request endpoint
- Implement transaction management
- Add notification creation
- Set up real-time subscriptions

### Phase 4: Polish & Testing (Week 3)
- Add animations and transitions
- Implement error handling
- Create comprehensive test suite
- Performance optimization

## Edge Cases to Consider

1. **Concurrent Modifications**: User A and B select same duty simultaneously
2. **Stale Data**: Selected duty gets deleted/modified during selection
3. **Network Failures**: Batch request partially succeeds
4. **Circular Swaps**: A→B, B→C, C→A scenarios
5. **Role Changes**: User's role changes mid-selection
6. **Time Zone Issues**: International flights crossing date boundaries
7. **Retroactive Swaps**: Attempting to swap past duties
8. **Maximum Selection**: Limiting number of simultaneous selections

## Success Metrics

- **Conversion Rate**: Selection starts → Swap requests sent
- **Time to Complete**: Average time from first selection to submission
- **Error Rate**: Failed validations / Total attempts
- **User Satisfaction**: Feedback on new interface vs old
- **Performance**: Time to render 100+ duties with selection enabled

High-level goals
- Make swapping quick and obvious (select → FAB → modal → submit).
- Prevent illegal swaps (rest/qualification/roster conflicts).
- Keep the UX predictable (what’s offered vs requested).
- Support negotiation (counteroffers) and auditability (logs, approvals).

1) Clarify ambiguous rule in your notes
You wrote:
- “Only one row at a time may be selected”
- “Multiple cards may be selected”

These can both be true depending on what “row” means. Two sensible interpretations:
- Option A — “One user row at a time” (recommended MVP): you can select multiple cards, but only from a single other user (i.e., you propose a swap to one person at a time). Pros: simpler, fewer edge cases; matches common usage.  

2) Selection interactions (front-end)
- Make “other users’ cards” clickable/selectable (your note).
- Selecting behavior (MVP, Option A):
  - Click one or more cards belonging to the same other user → they highlight.
  - Show a small owner badge on selection (eg. “To: John D.”).
  - Auto-highlight your own duties on the same day(s) — visually distinct (e.g., dashed border) but not auto-selected.
  - Allow you to pick which of your duties to offer in the modal (or allow quick-select from roster by clicking own cards if you prefer).
  - “Deselect all” button and Esc key to clear.
- Visual cues:
  - Non-clickable cards (your own) are still visible but dimmed (until in-modal for offering).
  - Tooltip on hover: “Click cards to propose swap. Only cards owned by others are selectable.”
  - Show selected count in a small chip: “2 selected”.

3) FAB behavior
- Sticky FAB bottom-right (or bottom-center on mobile), prominent color, swap icon and selected count: e.g., “Swap (2)”.
- Tapping FAB:
  - If no valid own duty candidates exist → show a proactive tooltip/warning: “No matching duties on your roster. Add one before proposing.”
  - Otherwise open the “Create swap” modal.

4) Modal: “I give — you get” design (details)
Layout: two-panel split or stacked on mobile
- Header: “Create swap — 2 selected (John D.)” + owner(s) avatars
- Left column: “You get” (pre-filled with the selected duties). Each card shows key details: date, time, pairing/leg numbers, total duty time, rest impact, location/base.
- Right column: “You give” (your duties to offer) — you can:
  - Auto-suggest offers (highlighted from your duties same day).
  - Let user select from their roster, or “Add from roster” button to open mini-picker.
- Middle/top controls:
  - Target: “Send to John D.” vs “Post to Marketplace (open)” toggle.
  - Atomic swap toggle: “All or nothing” (on by default). If off, explain partial acceptance rules.
  - Allow counteroffers (checkbox).
  - Request manager approval (checkbox) — if required by company rules.
- Preview area (collapsible): shows computed consequences:
  - Net flight/duty hours change per person
  - Rest rule warnings (red/yellow)
  - Qualification mismatches (red)
  - Payroll/time credits changes (if applicable)
- Notes: free-text message to the recipient.
- Buttons:
  - “Discard” or “Cancel” (left)
  - “Preview” (optional)
  - CTA on right: “Send Offer” or contextual “Post to Marketplace” / “Send to John D.” with a count: e.g., “Send offer to John D. (2 duties)”

Microcopy examples
- When rest rule warning: “Warning: Taking these duties will leave you with less than required rest (X hours). Manager approval required.”
- After submit: “Offer sent to John D. — pending reply. You’ll be notified.”

5) Validation & business rules (server-side + immediate UI)
Always validate on server and surface helpful warnings client-side:
- Hard rules (reject swap creation):
  - Qualification mismatch (aircraft type, rank).
  - Regulatory rest/flight duty violations.
  - Conflicting roster changes (the duty was changed/removed).
  - Blackout rules (reserve, training, legal constraints).
- Soft rules (allow with confirm):
  - Pay/credit changes (inform user; require acceptance).
  - Rest margin below recommended but above absolute minimum (warn).
- Timezones: store in UTC; display local times. Calculate rest windows correctly with time zone offsets.
- Use a legality engine (FDP/FAP) if you have one; otherwise encapsulate rules as service calls.

6) Acceptance/counteroffer/confirmation flow
- Targeted offer flow:
  1. Creator sends offer → status = “Pending” (locks not required yet).
  2. Recipient receives push/in-app → views original and consequences.
  3. Recipient can Accept / Reject / Counter.
     - Accept → server re-checks validity (duties not changed); commits swap; status = “Accepted / Completed”.
     - Counter → recipient crafts a new offer (pre-filled with original), sending it back; chain tracked.
     - Reject → status = “Rejected”.
  4. On Accept:
     - Immediate update to rosters.
     - Notify Ops/Payroll if required.
     - Add event in audit log.
- Marketplace (open) offer:
  - Offer posted public → first user to accept can accept; or allow recipients to place bids.
  - Consider “auto-accept” for open offers (if meets rules).
- Multi-card atomic behavior:
  - Default: atomic — either all requested duties are accepted or none.
  - If you enable partial, include clear UI about what happens if only a subset is accepted.

7) Concurrency & locking
- Don’t hold hard locks on selection (bad UX). Instead:
  - At creation time: perform transactional checks; if any requested/offered duty changed → reject and prompt to refresh.
  - For better UX, consider ephemeral soft-locks (server reserves duty for X minutes) only after user clicks “Send,” to reduce race conditions.
- Use version numbers or ETags on duty cards to detect concurrent updates (optimistic locking).

8) Data model (simplified)
DutyCard:
{
  id,
  user_id,
  date,
  start_time_utc,
  end_time_utc,
  pairing_id,
  legs: [{leg_no, origin, dest, flight_no}],
  aircraft_type,
  rank_required,
  status, // assigned, open, locked
  base,
  qualifications_required: [],
  version
}

SwapRequest:
{
  id,
  creator_id,
  requested_duty_ids: [],
  offered_duty_ids: [],
  recipients: [{user_id, duty_ids_owned_by_them}],
  status: enum[draft,pending,countered,accepted,rejected,cancelled,expired,executed],
  allow_partial: bool,
  require_manager_approval: bool,
  allow_counteroffers: bool,
  notes,
  created_at,
  expires_at,
  audit_log: [{actor, action, timestamp, details}],
  version
}

9) API endpoints (examples)
- GET /duties (filters)
- GET /duties/{id}
- POST /swaps
- GET /swaps/{id}
- POST /swaps/{id}/accept
- POST /swaps/{id}/reject
- POST /swaps/{id}/counter
- POST /swaps/{id}/withdraw
- GET /swaps?mine=true
- WebSocket /realtime for live updates

10) Notifications & messaging
- In-app push, mobile push, email fallback.
- Per-swap message thread for negotiation.
- Template notifications:
  - “You have a new swap offer from Alice.”
  - “Swap offer accepted — rosters updated.”
  - “Swap request expired.”

11) Edge cases & tricky scenarios
- Partial acceptance of multi-card swap: decide upfront whether allowed. If allowed, ensure payroll & rest calculations reflect partial outcome.
- Chain/multi-party swaps: advanced — need cycle detection, atomic commit across users.
- Reserve/standby duties: might be non-transferrable.
- Multi-leg/paired duties: swapping one leg might break continuity — detect and warn or require swapping entire pairing.
- Seniority/bid-line restrictions — integrate if you have business rules or union agreements.
- Admin override: ops/Admin may approve/reject even if both accepted.

12) Accessibility & mobile
- Modal must be keyboard-navigable and screen-reader friendly.
- FAB should be reachable via keyboard and have aria-label.
- On small screens, use stacked panels; show summary first; expand full details.
- Use color + icon + text for warnings (don’t rely on color alone).

13) UI polish & micro-interactions
- Show selected-owner avatar row in modal top so user knows who they’re sending to.
- Add a “Quick-suggest” button: “Pick best matching own duty” — algorithm picks duties closest in time/aircraft type.
- Show a small timeline view in the modal to visualize rest windows before/after swap.
- Show a “what changes” diff (hours, credits, base changes) that both parties must accept.

14) MVP vs Advanced roadmap
MVP (deliver first):
- Select other user’s duties (single-owner), FAB → modal “I give / you get” with manual pick of your duties.
- Basic legality checks (qualifications + simple rest checks).
- Targeted offers, accept/reject, counteroffer, notifications.
- Server-side optimistic locking and audit log.

Phase 2 (post-MVP):
- Marketplace / open offers.
- Multi-owner/multi-party swaps & chain swaps.
- Advanced legality engine integration (FDP, automation).
- Auto-suggestion matching algorithm, salary/time credit calculation.
- Manager approval workflow & payroll integration.

15) Tests & metrics
- Tests:
  - Unit: validation rules (qualification, rest calculation).
  - E2E: happy path swap, concurrent accept race, counteroffer path.
  - UX: mobile vs desktop flows.
- Metrics to track:
  - Swap requests per week, acceptance rate, time-to-accept, conflicts / failed swaps, manual admin overrides.

Questions for you
1. Do you want MVP to support swaps only between two users (recommended) or multi-user/broadcast swaps from day one?
2. Are manager/ops approvals required for any swaps in your org?
3. What fields are on each duty card today (pairing id, aircraft, times, rank)? That’ll determine what to show/surface in the modal.
4. Do you have or plan to integrate an FDP/legality engine for legal/rest calculations?
5. Is mobile the primary use-case (i.e., pilots using phones), or desktop-first?

If you want, I can:
- Sketch a specific modal UI layout (wireframe).
- Produce a precise API spec or DB schema for your stack.
- Draft the exact modal microcopy and toast messages for UX consistency.

Which part would you like to iterate on next?