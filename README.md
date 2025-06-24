Whats next:

[✔]1. Update duty modal: 
    - Auto close datepicker after date selection
    - Manual date entry
[ ]2. Insert Duties from Modal into database
[ ]3. Filter duties on roster page to show only duties from users of the same group (i.e. Captains only see Duties posted by other Captains etc.)
[ ]4. Add filters to roster page 
    - Filter by Departure Location
    - Arrival Location

What am I currently doing: 
- Adding admin role with admin dashboard permissions
    - Focusing on the problems that may arise by giving a user both admin and regular UserRole (i.e. FIRST_OFFICER)

    -CHECK THE APP/API/AUTH/REGISTER ROUTE FOR ADMIN AND BASE SELECTION !!!

    
- Creating an admin dashboard ( preferably check shadcnui dashboard example)



X. At some point add a function to only swap multiple duties at once. Some sort of linking of duties will be necessary. 


Claude Opus Suggestions: 
# CrewSwap UX Improvement Tasks

## Overview
CrewSwap is an aviation crew duty management system that enables crew members to manage flight assignments and swap duties with colleagues. This document outlines potential features and UX improvements to enhance the platform.

## 🎯 High Priority UX Improvements

### 1. Real-time Updates & Notifications
**Current Issue**: Users must manually refresh to see new swap requests or duty changes
**Solution**: 
- Implement WebSocket connection for real-time updates
- Add push notifications for critical events
- Show notification badges with unread count in header
- Add toast notifications for immediate feedback

**Implementation**:
```typescript
// Add Socket.io or similar for real-time updates
// Create notification service with event listeners
// Update UI components to subscribe to real-time events
```

### 2. Advanced Search & Filtering
**Current Issue**: No way to search or filter duties/swap requests
**Solution**:
- Add global search bar in header
- Implement filters for:
  - Date ranges
  - Flight numbers
  - Destinations
  - Crew members
  - Duty status
- Add saved filter presets

**Implementation**:
```typescript
// Add search API endpoints with query parameters
// Create reusable FilterPanel component
// Implement debounced search input
```

### 3. Calendar View for Duties
**Current Issue**: Roster view is limited to horizontal scroll
**Solution**:
- Add monthly calendar view option
- Show duties as events on calendar
- Color-code by duty type/status
- Enable drag-and-drop for swap requests
- Add week/month/year view toggles

**Implementation**:
```typescript
// Integrate react-big-calendar or similar
// Create calendar event adapters for duties
// Add view persistence in localStorage
```

## 🚀 Feature Enhancements

### 4. Duty Details Enhancement
**Current Issue**: Limited information shown on duty cards
**Solution**:
- Add expandable duty cards with:
  - Aircraft type
  - Crew composition
  - Layover information
  - Weather at destinations
  - Special requirements/notes
- Show duty history and changes
- Add print-friendly duty sheets

### 5. Smart Swap Suggestions
**Current Issue**: Manual browsing for suitable swaps
**Solution**:
- AI-powered swap recommendations based on:
  - Similar routes
  - Preferred destinations
  - Historical swap patterns
  - Crew compatibility
- "Quick Swap" feature for instant matches
- Swap preference profiles

### 6. Mobile App Experience
**Current Issue**: Limited mobile optimization
**Solution**:
- Create progressive web app (PWA)
- Add offline support for viewing duties
- Implement touch gestures for common actions
- Optimize layouts for small screens
- Add mobile-specific features (location check-in)

## 🛠️ Technical Improvements

### 7. Performance Optimization
**Solutions**:
- Implement virtual scrolling for long lists
- Add pagination to API endpoints
- Use React Query for caching
- Optimize bundle size with code splitting
- Add loading skeletons for better perceived performance

### 8. Accessibility Enhancements
**Solutions**:
- Add ARIA labels throughout
- Implement keyboard navigation
- Add high contrast mode

### 9. Dark Mode Support
**Current Issue**: Theme provider exists but not utilized
**Solution**:
- Implement dark mode toggle in header
- Create dark color palette
- Persist theme preference
- Add system preference detection

## 📊 Analytics & Reporting

### 10. Dashboard Analytics
**New Features**:
- Flight hours tracking
- Swap success rate metrics
- Popular route statistics
- Crew utilization reports
- Export functionality for reports

### 11. User Profile Enhancement
**New Features**:
- Profile photo upload
- Preferred airports/routes
- Availability calendar
- Swap history
- Performance metrics
- Emergency contact info

## 🔒 Security & Compliance

### 12. Audit Trail
**Implementation**:
- Log all duty changes
- Track swap request history
- Implement data retention policies
- Add export for compliance reports

### 13. Role-Based Permissions
**Enhancement**:
- Add supervisor roles
- Implement approval workflows
- Create read-only access levels
- Add delegation features

## 💬 Communication Features

### 14. In-App Messaging
**New Feature**:
- Direct messaging between crew members
- Swap request negotiations
- Group chats for flights
- Message history

### 15. Duty Trading Board
**New Feature**:
- Public board for posting available duties
- "Looking for" section
- Automated matching
- Fairness algorithm for distribution

## 🎨 UI/UX Polish

### 16. Onboarding Flow
**New Feature**:
- Interactive tour for new users
- Setup wizard for preferences
- Tutorial videos
- Help center integration

### 17. Customizable Dashboard
**Enhancement**:
- Draggable widget layout
- Customizable stat cards
- Quick actions panel
- Favorite routes/colleagues

## 📱 Integration Features

### 18. Calendar Sync
**New Feature**:
- Export to Google/Outlook calendar
- iCal feed generation
- Two-way sync options
- Reminder automation

### 19. Third-Party Integrations
**Potential Integrations**:
- Weather services
- Flight tracking APIs
- Hotel booking systems
- Ground transportation

## 🚦 Implementation Priority

### Phase 1 (Immediate - 1-2 months)
1. Real-time updates
2. Search & filtering
3. Dark mode
4. Mobile optimization
5. Performance improvements

### Phase 2 (Short-term - 3-4 months)
6. Calendar view
7. Enhanced duty details
8. Dashboard analytics
9. Profile enhancements
10. Accessibility improvements

### Phase 3 (Medium-term - 5-6 months)
11. Smart swap suggestions
12. In-app messaging
13. Audit trail
14. Calendar sync
15. Onboarding flow

### Phase 4 (Long-term - 6+ months)
16. PWA development
17. Third-party integrations
18. Duty trading board
19. Advanced analytics
20. AI-powered features

## 📈 Success Metrics
- Reduced swap request response time
- Increased successful swap rate
- Improved user engagement (DAU/MAU)
- Reduced support tickets
- Higher user satisfaction scores

## 🔧 Technical Recommendations
1. Upgrade to Next.js 14 app directory fully
2. Implement React Query for data fetching
3. Add comprehensive error boundaries
4. Implement proper logging system
5. Add E2E testing with Playwright
6. Set up CI/CD pipeline
7. Implement feature flags for gradual rollouts
