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
## Edge Cases to Consider

1. **Concurrent Modifications**: User A and B select same duty simultaneously
2. **Stale Data**: Selected duty gets deleted/modified during selection
3. **Network Failures**: Batch request partially succeeds
6. **Time Zone Issues**: International flights crossing date boundaries
7. **Retroactive Swaps**: Attempting to swap past duties
8. **Maximum Selection**: Limiting number of simultaneous selections

## Success Metrics

- **Conversion Rate**: Selection starts → Swap requests sent
- **Time to Complete**: Average time from first selection to submission
- **Error Rate**: Failed validations / Total attempts
- **User Satisfaction**: Feedback on new interface vs old
- **Performance**: Time to render 100+ duties with selection enabled