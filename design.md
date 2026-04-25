# LMS App — UI Design Prompt

> Paste this into Figma AI, v0.dev, or your AI IDE when working on screens only.

---

## App Identity

**App name**: LearnSpace
**Platform**: React Native (iOS + Android)
**Goal**: A focused, distraction-free learning app. Every screen should answer one question — what does the user need RIGHT NOW.

---

## Design Philosophy

**Minimal. Dark. Fast.**

- Dark navy base — not pure black, not grey. `#0D0F14` as canvas.
- One accent color only — violet `#6C63FF`. Used sparingly. Only on CTAs, active states, and key numbers.
- Reduce clicks ruthlessly. If something can be done in 1 tap, it must not require 2.
- No decorative elements. No illustrations. No gradients on UI surfaces.
- White space is generous — not cramped. Let content breathe.
- Cards feel like surfaces lifted off the background — same dark family, slightly lighter.

**The rule**: If removing an element doesn't break the flow, remove it.

---

## Color Tokens

```
Background base    : #0D0F14
Card surface       : #161B25
Elevated surface   : #1E2535  (search bars, tab bar, modals)
Input background   : #1A202E
Border subtle      : #1E2A3D
Border strong      : #2D3A52

Accent violet      : #6C63FF
Accent muted bg    : rgba(108, 99, 255, 0.12)  (chips, tags)

Text primary       : #F0F2F8
Text secondary     : #8892A4
Text muted         : #4E5A6E  (placeholders, disabled)

Success            : #34D399
Warning            : #FBBF24
Error              : #F87171
```

---

## Typography

```
Font — Headings  : Sora (700 Bold, 600 SemiBold)
Font — Body      : DM Sans (400 Regular, 500 Medium, 600 SemiBold)

Page title       : Sora 700 · 22px · #F0F2F8
Section title    : Sora 600 · 16px · #F0F2F8
Card title       : Sora 600 · 14px · #F0F2F8  · 2-line clamp
Body text        : DM Sans 400 · 13px · #8892A4 · line-height 1.7
Label / chip     : DM Sans 600 · 10px · uppercase · letter-spacing 0.06em
Caption          : DM Sans 400 · 11px · #4E5A6E
```

---

## Spacing & Shape

```
Screen side padding : 20px
Card border radius  : 16px
Button border radius: 12px
Input border radius : 12px
Chip border radius  : 8px
Avatar border radius: 9999px (full circle)

Section gap         : 32px
Card gap in list    : 12px
Inner card padding  : 16px
```

---

## Components

### Primary Button
```
Background   : #6C63FF
Text         : #FFFFFF · DM Sans 600 · 14px
Padding      : 14px vertical · full width
Border radius: 12px
Loading state: replace label with spinner, same size, disabled
Pressed state: scale 0.97, opacity 0.85
```

### Secondary Button
```
Background   : transparent
Border       : 1px solid #2D3A52
Text         : #F0F2F8 · DM Sans 600 · 14px
Padding      : 14px vertical
Border radius: 12px
```

### Input Field
```
Background   : #1A202E
Border       : 1px solid #1E2A3D
Border focus : 1px solid #6C63FF
Border radius: 12px
Padding      : 14px horizontal · 12px vertical
Text         : DM Sans 400 · 14px · #F0F2F8
Placeholder  : #4E5A6E
Label above  : DM Sans 600 · 10px · uppercase · #8892A4 · mb 6px
Error text   : DM Sans 400 · 11px · #F87171 · mt 4px
```

### Course Card
```
Background   : #161B25
Border radius: 16px
Overflow     : hidden

Thumbnail    : full width · 16:9 ratio · Expo Image with shimmer skeleton
Body padding : 12px

Title        : Sora 600 · 14px · #F0F2F8 · 2 lines max
Instructor   : row · avatar 20px circle · DM Sans 400 · 11px · #8892A4 · mt 4px
Footer       : space-between · mt 8px
  Left       : category chip
  Right      : bookmark icon (24px) — filled violet if saved, muted if not

Enrolled indicator: 2px left border in #6C63FF
```

### Category Chip / Badge
```
Background   : rgba(108,99,255,0.12)
Text         : #6C63FF · DM Sans 600 · 10px · uppercase · letter-spacing 0.06em
Padding      : 3px 8px
Border radius: 8px
```

### Search Bar
```
Background   : #1E2535
Border radius: 9999px (pill)
Padding      : 10px 16px
Icon         : search feather · 16px · #4E5A6E · left
Input        : DM Sans 400 · 13px · #F0F2F8 · no underline · flex 1
Clear icon   : only visible when text exists · x feather · 14px · #4E5A6E · right
```

### Tab Bar
```
Background   : #1E2535
Border top   : 1px solid #1E2A3D
Height       : 56px + safe area bottom

Each tab     : flex 1 · column · centered
Icon         : Feather · 22px · active=#6C63FF · inactive=#4E5A6E
Label        : DM Sans 600 · 9px · uppercase · active=#6C63FF · inactive=#4E5A6E
Active dot   : 4x4px · #6C63FF · rounded · below icon

Tabs         : Home (book-open) · Bookmarks (bookmark) · Profile (user)
```

### Offline Banner
```
Background   : #FBBF24
Padding      : 8px 20px
Icon         : wifi-off · 12px · #0D0F14
Text         : DM Sans 600 · 11px · #0D0F14
Animate      : slide down from top on lose connection · slide up on restore
```

### Skeleton / Loading
```
Base color   : #161B25
Shimmer color: #1E2535
Animation    : sweep left → right · 1.2s loop
Shape        : match exact layout of real component (no shift on load)
```

### Empty State
```
Icon   : Feather · 44px · #2D3A52 · centered
Title  : Sora 600 · 16px · #F0F2F8 · mt 16px
Body   : DM Sans 400 · 13px · #8892A4 · mt 6px · centered · max-width 220px
CTA    : Ghost button (text only · #6C63FF) · mt 20px · only when actionable
```

---

## Screens

### Auth Screens (Login + Register)

**One screen, two states (toggle — no navigation).**
Switching between Login and Register happens inline with a tab toggle at top — no separate routes, no back button needed.

```
Layout:
  Full screen · #0D0F14

  Top section (centered):
    App logo mark — 40x40 · #6C63FF bg · rounded 12px
    App name — Sora 700 · 24px · #F0F2F8 · mt 12px
    Tagline — DM Sans 400 · 13px · #8892A4 · mt 4px

  Toggle tabs (Login / Register):
    Container: #161B25 · rounded 12px · p 4px · mt 32px · mx 20px
    Active tab: #1E2535 · rounded 10px · DM Sans 600 · 13px · #F0F2F8
    Inactive  : transparent · DM Sans 400 · 13px · #8892A4

  Form card:
    #161B25 · rounded 16px · mx 20px · mt 16px · p 20px
    Fields stacked · gap 16px
    Submit button full width · mt 4px

  No hero image. No decorative art. Typography carries it.
```

**Reduce clicks**: Email + Password is 2 fields. Register adds Full Name only. No "confirm password" field — show password toggle instead.

---

### Home Tab (Course Catalog)

**Default view shows everything. Search is secondary.**

```
Header (no card, floats on background):
  pt safe area + 16px · px 20px
  "Good morning, {name} 👋" — Sora 700 · 20px · #F0F2F8
  "What will you learn today?" — DM Sans 400 · 13px · #8892A4 · mt 2px

Search bar:
  mx 20px · mt 12px · mb 4px
  (spec above)

Section label:
  "All Courses" — DM Sans 600 · 10px · #4E5A6E · uppercase · px 20px · mb 8px

Course list:
  LegendList · px 20px · gap 12px
  CourseCard (spec above)
  Pull to refresh built in

Offline: show offline banner at very top
```

**Reduce clicks**: Bookmark icon is directly on the card — no need to open course detail to save it. Tapping the card goes to detail.

---

### Course Detail Screen

**Hero image edge-to-edge. Content slides up over it.**

```
Hero section:
  Full width · aspect ratio 16:9 · edge to edge (no padding)
  Expo Image · shimmer placeholder
  Gradient overlay at bottom: transparent → #0D0F14 (60px tall)
  Back button: top-left · 32x32 · #1E2535/80% · rounded full · Feather arrow-left
  Bookmark button: top-right · same style as back

Content (overlaps hero by 16px negative margin-top):
  Background #0D0F14 · border-radius top 20px · px 20px · pt 16px

  Row: category chip + (enrolled badge if enrolled — green chip "Enrolled ✓")
  Title: Sora 700 · 20px · #F0F2F8 · mt 8px
  Price: Sora 700 · 22px · #6C63FF · mt 6px ("Free" if 0)

  Instructor card:
    #161B25 · rounded 12px · p 12px · flex-row · mt 12px
    Avatar 36x36 circle
    Name: Sora 600 · 13px · #F0F2F8
    Role: DM Sans 400 · 11px · #8892A4

  Description:
    DM Sans 400 · 13px · #8892A4 · line-height 1.7 · mt 12px
    Show 3 lines collapsed + "Read more" tap to expand (no navigation)

  Spacer: 80px (for sticky bar)

Sticky bottom bar:
  #1E2535 · border-top 1px #1E2A3D · px 20px · py 12px · pb safe area
  If NOT enrolled: two buttons side by side
    "View Content" Secondary (flex 1)
    "Enroll — Free" or "Enroll ₹X" Primary (flex 1)
  If enrolled: single full-width Primary button
    "Continue Learning →"
```

**Reduce clicks**: Enroll and View Content are both on the same sticky bar — no separate confirmation screen. Description expands inline — no new screen.

---

### Bookmarks Tab

```
Header:
  "Saved Courses" — Sora 700 · 20px · px 20px · pt safe+16

Count label:
  "{n} courses saved" — DM Sans 400 · 13px · #8892A4 · px 20px · mb 12px

Same CourseCard list as Home — no search bar needed here.

Empty state:
  bookmark icon · "Nothing saved yet" · "Tap 🔖 on any course to save it here." · no CTA button
```

---

### Profile Tab

**Show everything on one scroll — no nested settings screens.**

```
Header card (#161B25 · rounded-b 20px):
  Avatar: 72x72 · rounded full · border 2px #6C63FF
    Tap avatar → image picker directly (no edit button)
  Name: Sora 700 · 18px · #F0F2F8 · mt 10px · center
  Email: DM Sans 400 · 12px · #8892A4 · mt 2px · center

Stats row (mx 20px · mt 16px · gap 12px):
  Two cards side by side · #161B25 · rounded 12px · p 14px · centered
  Number: Sora 700 · 24px · #6C63FF
  Label:  DM Sans 600 · 9px · #4E5A6E · uppercase · mt 2px

Settings section (mt 24px):
  Section label: "Account" — DM Sans 600 · 10px · #4E5A6E · uppercase · px 20px · mb 8px

  Each row: #161B25 bg · px 20px · py 14px · border-b #1E2A3D
    Left: Feather icon (16px #8892A4) + label (DM Sans 500 · 13px · #F0F2F8) · gap 10px
    Right: Feather chevron-right (14px #2D3A52)

  Rows:
    - Edit Profile (user icon) → inline edit (slide-up sheet, not new screen)
    - Notifications (bell icon) → toggle switch inline on this row (no new screen)
    - Log Out (log-out icon · #F87171 text · no chevron) → confirmation alert
```

**Reduce clicks**: Notifications is a toggle right on the row — no settings screen. Tapping avatar opens picker directly. Log out is one tap + confirm alert.

---

## Interactions & Motion

Use `react-native-reanimated` only. Keep it purposeful.

```
Bookmark tap      : scale 0.8 → 1.0 with spring · icon color crossfade
Enroll button     : scale 0.97 on press · spring back
Tab icon active   : scale 1.15 spring on select
Offline banner    : translateY -40 → 0 on show · reverse on hide · withTiming 250ms
Card press        : opacity 0.7 on press via activeOpacity
Skeleton shimmer  : Animated.loop translateX sweep · 1.2s
Description expand: LayoutAnimation.configureNext for height change
```

No page transitions override. No parallax. No swipe gestures. Default Expo Router transitions are fine.

---

## Icons

Use **Feather** icons exclusively from `@expo/vector-icons`. Do not mix sets.

```
Home tab      : book-open
Bookmarks tab : bookmark
Profile tab   : user
Search        : search
Back          : arrow-left
Bookmark fill : use Ionicons bookmark (filled) for saved state only
Settings      : settings
Logout        : log-out
Wifi off      : wifi-off
Camera        : camera
Chevron right : chevron-right
Check         : check-circle (success green)
Alert         : alert-circle (error red)
```

---

## What Not To Do

```
✗ No white backgrounds anywhere
✗ No purple gradient hero banners
✗ No card shadows (depth comes from color contrast, not shadows)
✗ No bottom sheet modals for simple actions — inline or alert only
✗ No confirmation screens for enrolling — one tap on sticky bar is enough
✗ No onboarding flow — login goes straight to Home
✗ No hamburger menu
✗ No floating action buttons
✗ No toast notifications for every action — silent is better when action is obvious
✗ No loading spinners — skeletons only
✗ No placeholder illustrations (empty robot, sad cloud, etc.)
```

---

## Screen Flow (Minimum Taps)

```
Open app
  └─ Already logged in → Home (0 taps)
  └─ Not logged in → Login screen

Login
  └─ Fill email + password → Tap "Sign In" → Home (1 tap)

Bookmark a course
  └─ Tap bookmark icon on card in Home (1 tap)

View course detail
  └─ Tap course card (1 tap)

Enroll in course
  └─ Tap course card → tap Enroll (2 taps total)

View course content
  └─ Tap course card → tap "View Content" (2 taps total)

Log out
  └─ Profile tab → tap Log Out → confirm (3 taps — unavoidable for safety)
```