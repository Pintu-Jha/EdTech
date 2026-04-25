# Mini LMS App

Production-focused mobile LMS app built with Expo + TypeScript.  
The app maps a generic public API into an LMS domain and demonstrates auth flow, resilient API handling, offline-aware UX, bookmarks, local enrollments, and in-app course viewing via WebView.

## Setup

1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd EdTechAssignment
npm install
```

2. Add env values

```bash
cp .env.example .env
```

3. Run the app

```bash
npm run start
```

4. Open target platform from Expo CLI
- `a` for Android emulator
- `i` for iOS simulator
- or scan QR with Expo Go

## Architecture Overview

### Folder Roles

- `app/`: Expo Router screens and navigation groups (`(auth)`, `(tabs)`, `course`)
- `src/api/`: HTTP client, interceptors, endpoint modules
- `src/stores/`: Zustand state for auth, courses, and UI
- `src/services/`: secure storage, MMKV storage, notifications
- `src/components/`: UI primitives, course cards, layout and webview components
- `src/hooks/`: domain hooks for auth/courses/bookmarks/network/notifications
- `src/utils/`: constants, logger, validators, mappers
- `src/types/`: API/domain/navigation typing contracts

### Data Flow (ASCII)

```text
Screens (app/*)
   |
   v
Hooks (src/hooks/*)
   |
   v
Zustand Stores (src/stores/*) <----> Services (storage, notifications)
   |
   v
API Modules (src/api/*)
   |
   v
Axios Client (interceptors + retry + auth) ---> Remote API
```

## Key Decisions

- **Zustand over Redux**: Lower boilerplate while keeping predictable state boundaries and strong typing.
- **MMKV over AsyncStorage**: Better runtime performance for cache/bookmark-heavy mobile flows.
- **LegendList over FlashList**: Strong dynamic-height list behavior with clean API for this project shape.

## Known Limitations

- API data is randomized, so course/instructor pairings are synthetic.
- Local enrollments are persisted on-device only (no backend enroll API).
- Notification UX is implemented; platform-specific production tuning (channels/icons/sounds) is minimal.
- Viewer content is HTML template-based and not tied to a real learning-content backend.

## Screenshots

| Screen | Placeholder Path |
|---|---|
| Login | `assets/images/screenshots/login.png` |
| Home Catalog | `assets/images/screenshots/home.png` |
| Course Detail | `assets/images/screenshots/course-detail.png` |
| WebView Viewer | `assets/images/screenshots/viewer.png` |
| Profile | `assets/images/screenshots/profile.png` |

## APK Build Instructions

Use EAS Build (recommended):

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

After completion, download the generated APK from the EAS build URL.
