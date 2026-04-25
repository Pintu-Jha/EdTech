# Mini LMS App — Full Build Plan

> Paste this entire file into your AI IDE as the starting context before generating any code.

---

## Role & Context

You are helping me build a **production-quality Mini LMS Mobile App** using React Native Expo. This is an assignment submission where I need to demonstrate senior-level engineering, not a tutorial project. Every decision should reflect real-world practices — architecture, error handling, performance, and code organization all matter equally.

I am a React Native developer with 1.5 years of production experience. I've worked on B2B and ERP mobile apps. I'm comfortable with TypeScript, Redux, Socket.io, offline-first patterns, and the Expo ecosystem. Write code accordingly — no hand-holding, no over-explaining basics.

---

## Tech Stack

```
Framework      : React Native Expo (latest stable SDK)
Language       : TypeScript (strict mode)
Navigation     : Expo Router (file-based)
Styling        : NativeWind v4 (Tailwind CSS for RN)
State          : Zustand (lightweight, replaces Redux for this project)
Persistence    : Expo SecureStore (tokens) + MMKV (app data, via zustand-mmkv)
List           : LegendList (replaces FlashList — better perf for dynamic heights)
Forms          : React Hook Form + Zod
Images         : Expo Image
HTTP           : Axios with interceptors + retry logic
WebView        : react-native-webview
Notifications  : expo-notifications
Network        : @react-native-community/netinfo
```

> Do not add libraries not listed above unless you explicitly explain why and ask first.

---

## Folder Structure

Generate this exact structure. Do not deviate.

```
lms-app/
├── app/                          # Expo Router pages
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Course catalog (home)
│   │   ├── bookmarks.tsx
│   │   └── profile.tsx
│   ├── course/
│   │   ├── [id].tsx              # Course detail
│   │   └── viewer.tsx            # WebView screen
│   ├── _layout.tsx               # Root layout
│   └── +not-found.tsx
│
├── src/
│   ├── api/
│   │   ├── client.ts             # Axios instance, interceptors, retry
│   │   ├── auth.ts               # Auth endpoints
│   │   ├── courses.ts            # Course/product endpoints
│   │   └── users.ts              # User profile endpoints
│   │
│   ├── components/
│   │   ├── ui/                   # Primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── SkeletonLoader.tsx
│   │   ├── course/
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseCardSkeleton.tsx
│   │   │   └── BookmarkButton.tsx
│   │   ├── layout/
│   │   │   ├── OfflineBanner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── SafeScrollView.tsx
│   │   └── webview/
│   │       ├── CourseWebView.tsx
│   │       └── WebViewErrorFallback.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCourses.ts
│   │   ├── useBookmarks.ts
│   │   ├── useNetwork.ts
│   │   └── useNotifications.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts          # Zustand — auth state
│   │   ├── courseStore.ts        # Zustand — courses + bookmarks
│   │   └── uiStore.ts            # Zustand — toasts, loading
│   │
│   ├── services/
│   │   ├── notificationService.ts
│   │   ├── storageService.ts     # MMKV wrapper
│   │   └── secureStorageService.ts # SecureStore wrapper
│   │
│   ├── types/
│   │   ├── api.types.ts
│   │   ├── course.types.ts
│   │   ├── user.types.ts
│   │   └── navigation.types.ts
│   │
│   ├── utils/
│   │   ├── mappers.ts            # Map API response → app model
│   │   ├── validators.ts         # Zod schemas
│   │   ├── constants.ts
│   │   └── logger.ts             # Dev-only logger wrapper
│   │
│   └── webview/
│       └── courseTemplate.ts     # HTML template generator for WebView
│
├── assets/
│   ├── fonts/
│   └── images/
│
├── .env.example
├── app.json
├── babel.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Architecture Decisions (explain these if asked why)

### Why Zustand over Redux?
Redux adds significant boilerplate for a project this size. Zustand gives the same predictability with slices, middleware, and DevTools support — and works perfectly with MMKV persistence via `zustand/middleware`. The stores are still structured as slices so migration to Redux is trivial.

### Why MMKV over AsyncStorage?
MMKV is synchronous and ~30x faster. For a list-heavy app with bookmarks, course cache, and user preferences, this matters. AsyncStorage is fine for web-targeted code but not optimal for native.

### Why LegendList over FlashList?
FlashList requires fixed item sizes or `overrideItemLayout`. LegendList handles dynamic heights natively and is designed as a drop-in replacement. For course cards with variable description lengths, this avoids layout jumps.

### Why file-based routing (Expo Router)?
Deep linking is free. Auth guards are clean via layout-level redirects. The `(auth)` and `(tabs)` group pattern is standard and readable.

---

## API Mapping

The assignment uses a generic API. Map it to LMS domain logic like this:

| API Endpoint | Treated As |
|---|---|
| `/api/v1/public/randomproducts` | Courses |
| `/api/v1/public/randomusers` | Instructors |
| `/api/v1/users/login` | Auth login |
| `/api/v1/users/register` | Auth register |
| `/api/v1/users/self` | Current user profile |

### Response Mapper Pattern

Do not use raw API types in UI components. Always map through `src/utils/mappers.ts`:

```typescript
// src/types/course.types.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  instructor: Instructor;
  isBookmarked: boolean;
  isEnrolled: boolean;
}

// src/utils/mappers.ts
export function mapProductToCourse(product: RawProduct, instructor: RawUser): Course {
  return {
    id: String(product.id),
    title: product.title,
    description: product.description,
    thumbnail: product.thumbnail,
    price: product.price,
    category: product.category,
    instructor: mapUserToInstructor(instructor),
    isBookmarked: false,
    isEnrolled: false,
  };
}
```

---

## Axios Client — Full Requirements

`src/api/client.ts` must implement:

1. Base URL from `process.env.EXPO_PUBLIC_API_BASE_URL`
2. Request interceptor — attach Bearer token from SecureStore
3. Response interceptor — on 401, attempt token refresh, retry original request once, then logout
4. Retry logic — on network timeout or 5xx, retry up to 2 times with exponential backoff (500ms, 1000ms)
5. Request timeout — 10 seconds default
6. Typed response wrapper:

```typescript
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

---

## Auth Store — Full Requirements

`src/stores/authStore.ts` using Zustand:

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;      // Called in root layout on app start
  updateProfile: (data: Partial<User>) => Promise<void>;
}
```

- Token stored in `SecureStore` under key `auth_token`
- User object stored in MMKV under key `auth_user`
- `restoreSession` runs on app start — validates token with `/api/v1/users/self`, auto-logs-in if valid, clears storage if 401

---

## Course Store — Full Requirements

`src/stores/courseStore.ts`:

```typescript
interface CourseState {
  courses: Course[];
  bookmarks: Set<string>;           // course IDs
  searchQuery: string;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;

  fetchCourses: () => Promise<void>;
  refreshCourses: () => Promise<void>;
  toggleBookmark: (courseId: string) => void;
  setSearchQuery: (q: string) => void;
  getFilteredCourses: () => Course[];       // derived, memoized
}
```

- Bookmarks persisted to MMKV key `bookmarks`
- Courses cached in MMKV key `courses_cache` with a TTL of 5 minutes
- When loading from cache, show stale data immediately then refresh in background (stale-while-revalidate pattern)

---

## WebView Implementation

`src/components/webview/CourseWebView.tsx` requirements:

1. Generate HTML from `src/webview/courseTemplate.ts` — a function that takes a `Course` object and returns a full HTML string with inline styles (no external CSS/JS dependencies)
2. Load the HTML as `source={{ html: generatedHtml }}` — no remote URL needed
3. Inject course data from native to WebView using `injectedJavaScriptBeforeContentLoaded`
4. Send events from WebView back to native using `window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }))`
5. Handle `onMessage` in native to process WebView events (e.g., user taps "Enroll" inside WebView)
6. Show `WebViewErrorFallback` component on load error
7. Show loading spinner while WebView loads

The HTML template should render:
- Course title, description, instructor info
- Course thumbnail image (passed as base64 or URL)
- A styled "Enroll Now" button that posts a message back to native

---

## Notification Logic

`src/services/notificationService.ts`:

1. Request permissions on first app launch — store permission status in MMKV
2. Do not re-request if already denied (show a settings prompt instead)
3. **Bookmark milestone notification**: When bookmark count reaches 5 (and every 5 after that), schedule a local notification: `"You've bookmarked {n} courses! Ready to start learning?"`
4. **Re-engagement notification**: On app open, check last open timestamp from MMKV. If > 24 hours, schedule a notification 1 second later: `"Pick up where you left off — your courses are waiting."`
5. Update last open timestamp in MMKV on every app foreground event

---

## Network Handling

`src/hooks/useNetwork.ts`:

- Use `@react-native-community/netinfo` to monitor connectivity
- Expose `isConnected: boolean` and `isInternetReachable: boolean`
- `OfflineBanner` component subscribes to this hook and shows an animated banner at top of screen when offline
- All API calls check `isConnected` before firing — surface a user-friendly error instead of a network failure

---

## Error Handling Strategy

### API Layer
- Axios interceptor catches all errors, maps them to `AppError` type with `code`, `message`, `isRetryable`
- Retry logic only for `isRetryable` errors (network timeout, 503)

### UI Layer
- `ErrorBoundary` wraps the entire tab navigator
- Per-screen error states with a retry button (not just a toast)
- All async operations in stores use try/catch with error state updates

### WebView Layer
- `onError` and `onHttpError` props handled
- Show `WebViewErrorFallback` with a reload button on failure

---

## List Performance Requirements

In the Course Catalog screen:

- Use `LegendList` (not FlatList or FlashList)
- `keyExtractor` must use `item.id` (string)
- `CourseCard` must be wrapped in `React.memo` with a custom comparator
- `BookmarkButton` is a separate memoized component — does NOT re-render when other courses update
- Pull-to-refresh via `refreshControl` prop — update `isRefreshing` in store
- Search filter runs on the memoized `getFilteredCourses` selector, not on the full list on every render

---

## TypeScript Requirements

- `strict: true` in `tsconfig.json`
- No `any` types — use `unknown` + type narrowing where needed
- All API responses typed with interfaces in `src/types/api.types.ts`
- Zod schemas in `src/utils/validators.ts` for all form inputs and API responses
- Navigation params typed via `src/types/navigation.types.ts`
- All Zustand stores fully typed with interfaces

---

## Screen-by-Screen Implementation Notes

### Login / Register
- React Hook Form + Zod validation
- Show field-level errors inline (not just toast)
- Disable submit button while loading
- Show password toggle (eye icon)
- On success, Expo Router redirects to `/(tabs)/`

### Course Catalog (Home Tab)
- Show `CourseCardSkeleton` while loading (not a spinner)
- Search bar at top with 300ms debounce
- Pull-to-refresh
- Empty state when search has no results
- Offline state — load from MMKV cache, show banner

### Course Detail
- Full course info + instructor section
- Enroll button (local state only, no API — save enrolled IDs to MMKV)
- Bookmark toggle syncs with store
- "View Course Content" button → navigates to `course/viewer.tsx`

### WebView Viewer
- Back button in header
- Progress bar while loading
- Full HTML template rendered for the course
- Handle back gesture properly on Android

### Profile Tab
- Display user avatar (use Expo Image with fallback)
- Show stats: Enrolled count, Bookmarked count
- Logout button with confirmation alert
- Edit profile — allow updating display name (local-first, sync to API)

### Bookmarks Tab
- Same `LegendList` + `CourseCard` pattern as home
- Empty state with a CTA to browse courses

---

## Environment Variables

`.env.example`:
```
EXPO_PUBLIC_API_BASE_URL=https://api.freeapi.app
EXPO_PUBLIC_APP_ENV=development
```

Load via `process.env.EXPO_PUBLIC_*` — Expo exposes these natively, no dotenv needed.

---

## Code Style Rules

These apply to every file generated:

- No default exports for components (named exports only) — exception: Expo Router screen files which require default export
- No inline styles — use NativeWind className exclusively
- No `console.log` in production code — use `src/utils/logger.ts` which wraps logs behind `__DEV__`
- No magic strings — use constants from `src/utils/constants.ts`
- Hooks must not contain JSX
- Services must not import from stores (one-way dependency)
- Stores can import from services and API modules
- Components can import from hooks, stores, and UI components only

---

## README Requirements

The README must include:
1. Project overview (2–3 lines)
2. Setup instructions (clone → install → env → run)
3. Architecture overview (folder purpose, data flow diagram in ASCII)
4. Key decisions (why Zustand, why MMKV, why LegendList)
5. Known limitations
6. Screenshot table (placeholder paths)
7. APK build instructions

---

## Build Order

Follow this order when generating code. Do not skip ahead.

```
Phase 1 — Foundation
  1. Project scaffold + tsconfig + NativeWind setup
  2. Folder structure creation
  3. Constants, types, logger utility
  4. SecureStorage service + MMKV storage service

Phase 2 — API Layer
  5. Axios client with interceptors + retry
  6. Auth API module
  7. Courses + Users API modules
  8. Zod validators for all API payloads

Phase 3 — State
  9. Auth store (Zustand)
  10. Course store with MMKV persistence
  11. UI store (toasts, loading)

Phase 4 — Navigation & Auth
  12. Root layout with session restore
  13. Auth screens (login, register)
  14. Tab layout

Phase 5 — Screens
  15. Course catalog screen
  16. Course detail screen
  17. WebView viewer screen
  18. Profile screen
  19. Bookmarks screen

Phase 6 — Components
  20. UI primitives (Button, Input, Card, Badge)
  21. CourseCard + Skeleton
  22. OfflineBanner
  23. ErrorBoundary

Phase 7 — Native Features
  24. Notification service
  25. Network hook
  26. WebView HTML template

Phase 8 — Polish
  27. Loading skeletons everywhere
  28. Empty states
  29. Error fallbacks
  30. README
```

---

## What to Avoid

These patterns make the project look AI-generated or junior-level. Do not use them:

- `StyleSheet.create({})` — we use NativeWind only
- `AsyncStorage` directly — wrap via `storageService.ts`
- `useEffect` for data fetching — use store actions called from `useEffect` in hooks, not inline in screens
- Prop drilling more than 2 levels — use store or context
- Catching errors with `catch(e: any)` — use `unknown` + type guard
- Hardcoded colors outside Tailwind config
- Screens that are 300+ lines — extract components early
- Comments that explain *what* the code does (code should be self-documenting) — only comment *why* when non-obvious

---

## Start Command

When ready to begin, start with **Phase 1** only. After generating Phase 1, stop and wait for confirmation before proceeding to Phase 2. This prevents generating unusable code that doesn't fit the actual project setup.