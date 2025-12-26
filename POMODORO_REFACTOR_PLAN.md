# Butterfly Pomodoro Refactor Implementation Plan

## Overview
Restructure from 5 tabs to 3 tabs with progressive disclosure and Butterfly Plus integration.

## Tab Structure Changes

### BEFORE (5 tabs):
1. Timer
2. Tasks
3. Calendar
4. Achievements
5. Statistics

### AFTER (3 tabs):
1. **Timer** - Standalone (unchanged)
2. **Planner** - Tasks + Calendar combined (split layout)
3. **Progress** - Achievements + Statistics combined (stacked layout with progressive unlock)

## Key Features

### 1. Progressive Disclosure (Stats Unlock)
- **Threshold**: 3 completed sessions
- **Before unlock**: Show friendly message card "Your stats will unlock after 3 focus sessions" with progress indicator (1/3, 2/3, 3/3)
- **After unlock**: Show full stats section

### 2. Butterfly Plus Premium Gating

#### FREE Features:
- Timer (all presets work)
- Basic task list (add/complete tasks)
- Basic calendar (highlights with completed sessions)
- Basic achievements (tier 1 only: "1st Flight", "Focus Trio", etc.)
- Basic stats after 3 sessions (last 7 days only, simple KPIs)

#### PREMIUM Features (Butterfly Plus):
- Advanced stats (30 days / all-time history)
- Enhanced insights (best focus day, avg session length, time distribution)
- Task scheduling (set start times)
- Unlimited favorites + quick reuse
- Distraction log (log interruption reason on early stop)
- Top distractions insight
- Ad-free experience

### 3. Premium Lock UI
- Locked features visible with blur overlay
- Lock icon + "Unlock with Butterfly Plus" text
- Click opens upgrade modal

### 4. Upgrade Modal
**Components:**
- Headline: "Unlock Butterfly Plus Benefits"
- Feature bullets with icons
- Buttons: "Go to Butterfly Plus Plans" / "Maybe Later"
- Links to pricing page

## Data Structure

### LocalStorage Keys:
```javascript
BH_user          // { username, plan: 'free'|'monthly'|'lifetime', joinDate, ... }
BH_tasks         // [ { id, text, completed, date, favorite, schedule } ]
BH_sessions      // [ { date, duration, taskId, completed, interrupted } ]
BH_schedules     // [ { taskId, startTime, days } ] (premium only)
```

### Constants:
```javascript
const STATS_UNLOCK_THRESHOLD = 3; // sessions needed to unlock stats
const FREE_STATS_DAYS = 7;         // free users see last 7 days
const PREMIUM_STATS_DAYS = 30;     // premium users see last 30 days
```

## Implementation Steps

### Step 1: Update HTML Structure
- Replace 5 tab buttons with 3
- Combine Tasks + Calendar into "Planner" section
- Combine Achievements + Statistics into "Progress" section
- Add stats unlock placeholder card
- Add premium lock overlay template
- Add upgrade modal

### Step 2: Update CSS
- Layout for split Planner view (tasks left, calendar right)
- Layout for stacked Progress view (achievements top, stats bottom)
- Premium lock overlay styles (blur + lock icon)
- Stats unlock placeholder card styles
- Upgrade modal styles
- Responsive breakpoints for mobile

### Step 3: Update JavaScript

#### Core State Management:
```javascript
// User state
function getUser() { ... }
function isPremium() { return getUser().plan !== 'free'; }

// Session tracking
function getCompletedSessionsCount() { ... }
function hasUnlockedStats() { return getCompletedSessionsCount() >= 3; }

// Premium gating
function checkFeatureAccess(feature) { ... }
function showUpgradeModal() { ... }
```

#### Tab Switching:
- Update switchTab() to handle 3 tabs
- Show/hide appropriate combined sections

#### Progressive Stats:
- Check session count on page load
- Show placeholder if < 3 sessions
- Show full stats if >= 3 sessions
- Update progress indicator

#### Premium Features:
- Add lock checks before premium features
- Show blur overlay on premium sections for free users
- Handle upgrade modal open/close
- Link to pricing page (stub if needed)

## Files to Modify

1. **butterfly-pomodoro.html** - Complete restructure
   - HTML nav tabs (774-816)
   - Section layouts
   - Add modal/overlay templates

2. **Inline CSS** (within <style> tag)
   - Premium lock overlay
   - Combined layouts
   - Modal styles

3. **Inline JavaScript** (within <script> tag)  
   - State management
   - Gating logic
   - Tab switching
   - Upgrade modal

## Testing Checklist

- [ ] Tab switching works (3 tabs)
- [ ] Planner shows tasks + calendar side by side (desktop) or stacked (mobile)
- [ ] Progress shows unlock message for new users (< 3 sessions)
- [ ] Stats appear after 3 completed sessions
- [ ] Free users see 7-day stats only
- [ ] Premium users see 30-day stats + insights
- [ ] Premium lock overlay appears on locked features
- [ ] Upgrade modal opens/closes correctly
- [ ] Mobile responsive (all layouts work on small screens)
- [ ] LocalStorage keys save correctly
- [ ] Y2K neon aesthetic maintained

## Code Comments to Add

```javascript
// === CONFIGURATION ===
// Change these thresholds as needed

// === FREE VS PREMIUM FEATURES ===
// Add new premium features here

// === GATING LOGIC ===
// How to check if user can access a feature

// === PROGRESSIVE DISCLOSURE ===
// Stats unlock logic

// === FUTURE ENHANCEMENTS ===
// Where to add new premium features
```

---

**Next**: Implement the code changes
