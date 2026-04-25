export const STORAGE_KEYS = {
  authToken: "auth_token",
  refreshToken: "refresh_token",
  authUser: "auth_user",
  bookmarks: "bookmarks",
  enrolledCourseIds: "enrolled_course_ids",
  coursesCache: "courses_cache",
  coursesCacheTimestamp: "courses_cache_ts",
  notificationPermissionStatus: "notification_permission_status",
  lastAppOpenTimestamp: "last_app_open_ts",
  bookmarkMilestoneCount: "bookmark_milestone_count",
  appEnv: "app_env",
} as const;

export const APP_CONFIG = {
  appName: "LearnSpace",
  apiTimeoutMs: 10_000,
  courseCacheTtlMs: 5 * 60 * 1000,
} as const;

export const COLORS = {
  canvas: "#0D0F14",
  card: "#161B25",
  elevated: "#1E2535",
  inputBg: "#1A202E",
  borderSubtle: "#1E2A3D",
  borderStrong: "#2D3A52",
  accent: "#6C63FF",
  accentMuted: "rgba(108, 99, 255, 0.12)",
  textPrimary: "#F0F2F8",
  textSecondary: "#8892A4",
  textMuted: "#4E5A6E",
  success: "#34D399",
  warning: "#FBBF24",
  error: "#F87171",
  transparent: "transparent",
} as const;
