import { create } from "zustand";

import { fetchCourses } from "@/api/courses";
import { fetchInstructors } from "@/api/users";
import { notificationService } from "@/services/notificationService";
import { storageService } from "@/services/storageService";
import type { Course } from "@/types/course.types";
import { APP_CONFIG, STORAGE_KEYS } from "@/utils/constants";
import { mapProductToCourse } from "@/utils/mappers";

interface CoursesCachePayload {
  courses: Course[];
}

interface CourseState {
  courses: Course[];
  bookmarks: Set<string>;
  searchQuery: string;
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  fetchCourses: () => Promise<void>;
  refreshCourses: () => Promise<void>;
  loadMoreCourses: () => Promise<void>;
  toggleBookmark: (courseId: string) => void;
  setSearchQuery: (query: string) => void;
  getFilteredCourses: () => Course[];
}

function readBookmarks(): Set<string> {
  const rawBookmarks = storageService.getString(STORAGE_KEYS.bookmarks);
  if (!rawBookmarks) return new Set<string>();

  try {
    const parsed = JSON.parse(rawBookmarks) as string[];
    return new Set(parsed);
  } catch {
    storageService.delete(STORAGE_KEYS.bookmarks);
    return new Set<string>();
  }
}

function writeBookmarks(bookmarks: Set<string>): void {
  storageService.setString(STORAGE_KEYS.bookmarks, JSON.stringify([...bookmarks]));
}

function readCoursesCache(): CoursesCachePayload | null {
  const rawCache = storageService.getString(STORAGE_KEYS.coursesCache);
  if (!rawCache) return null;

  try {
    return JSON.parse(rawCache) as CoursesCachePayload;
  } catch {
    storageService.delete(STORAGE_KEYS.coursesCache);
    storageService.delete(STORAGE_KEYS.coursesCacheTimestamp);
    return null;
  }
}

function writeCoursesCache(courses: Course[]): void {
  storageService.setString(STORAGE_KEYS.coursesCache, JSON.stringify({ courses }));
  storageService.setNumber(STORAGE_KEYS.coursesCacheTimestamp, Date.now());
}

async function getMappedCourses(page: number, limit: number, bookmarks: Set<string>): Promise<{ courses: Course[]; hasMore: boolean }> {
  const [productsResponse, instructorsResponse] = await Promise.all([fetchCourses({ page, limit }), fetchInstructors({ page, limit })]);
  const instructors = instructorsResponse.data.users;
  const fallbackInstructor = instructors[0];

  const courses = productsResponse.data.products.map((product, index) => {
    const instructor = instructors[index % instructors.length] ?? fallbackInstructor;
    const mapped = mapProductToCourse(product, instructor);

    return {
      ...mapped,
      isBookmarked: bookmarks.has(mapped.id),
    };
  });

  return {
    courses,
    hasMore: productsResponse.data.products.length >= 10,
  };
}

let lastCoursesRef: Course[] = [];
let lastQuery = "";
let lastFilteredResult: Course[] = [];

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  bookmarks: readBookmarks(),
  searchQuery: "",
  isLoading: false,
  isLoadingMore: false,
  isRefreshing: false,
  error: null,
  page: 1,
  hasMore: true,

  async fetchCourses() {
    const cache = readCoursesCache();
    const cacheTimestamp = storageService.getNumber(STORAGE_KEYS.coursesCacheTimestamp);
    const isFresh = typeof cacheTimestamp === "number" && Date.now() - cacheTimestamp <= APP_CONFIG.courseCacheTtlMs;

    if (cache?.courses.length) {
      set({
        courses: cache.courses.map((course) => ({
          ...course,
          isBookmarked: get().bookmarks.has(course.id),
        })),
        isLoading: false,
        error: null,
      });
    } else {
      set({ isLoading: true, error: null });
    }

    if (isFresh && cache?.courses.length) {
      return;
    }

    try {
      const { courses, hasMore } = await getMappedCourses(1, 10, get().bookmarks);
      writeCoursesCache(courses);

      set({
        courses,
        hasMore,
        page: 1,
        error: null,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch courses";
      set({
        error: message,
        isLoading: false,
      });
    }
  },

  async refreshCourses() {
    set({ isRefreshing: true, error: null });

    try {
      const { courses, hasMore } = await getMappedCourses(1, 10, get().bookmarks);
      writeCoursesCache(courses);

      set({
        courses,
        hasMore,
        page: 1,
        isRefreshing: false,
        error: null,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to refresh courses";
      set({
        isRefreshing: false,
        error: message,
      });
    }
  },

  async loadMoreCourses() {
    const { page, hasMore, isLoading, isLoadingMore, bookmarks, courses } = get();
    if (!hasMore || isLoading || isLoadingMore) return;

    set({ isLoadingMore: true, error: null });

    try {
      const nextPage = page + 1;
      const { courses: newCourses, hasMore: nextHasMore } = await getMappedCourses(nextPage, 10, bookmarks);
      
      const allCourses = [...courses, ...newCourses];
      writeCoursesCache(allCourses);

      set({
        courses: allCourses,
        page: nextPage,
        hasMore: nextHasMore,
        isLoadingMore: false,
        error: null,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load more courses";
      set({
        isLoadingMore: false,
        error: message,
      });
    }
  },

  toggleBookmark(courseId) {
    const nextBookmarks = new Set(get().bookmarks);
    if (nextBookmarks.has(courseId)) {
      nextBookmarks.delete(courseId);
    } else {
      nextBookmarks.add(courseId);
    }

    writeBookmarks(nextBookmarks);

    const nextCourses = get().courses.map((course) =>
      course.id === courseId ? { ...course, isBookmarked: nextBookmarks.has(courseId) } : course,
    );
    writeCoursesCache(nextCourses);

    set({
      bookmarks: nextBookmarks,
      courses: nextCourses,
    });

    void notificationService.scheduleBookmarkMilestone(nextBookmarks.size);
  },

  setSearchQuery(query) {
    set({ searchQuery: query });
  },

  getFilteredCourses() {
    const { courses, searchQuery } = get();
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (courses === lastCoursesRef && normalizedQuery === lastQuery) {
      return lastFilteredResult;
    }

    const filtered = normalizedQuery
      ? courses.filter((course) => {
          const title = course.title.toLowerCase();
          const category = course.category.toLowerCase();
          const instructor = course.instructor.name.toLowerCase();
          return (
            title.includes(normalizedQuery) ||
            category.includes(normalizedQuery) ||
            instructor.includes(normalizedQuery)
          );
        })
      : courses;

    lastCoursesRef = courses;
    lastQuery = normalizedQuery;
    lastFilteredResult = filtered;
    return filtered;
  },
}));
