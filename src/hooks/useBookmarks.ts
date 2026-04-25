import { useCourseStore } from "@/stores/courseStore";

export function useBookmarks() {
  const bookmarks = useCourseStore((state) => state.bookmarks);
  const courses = useCourseStore((state) => state.courses);
  const toggleBookmark = useCourseStore((state) => state.toggleBookmark);

  const bookmarkedCourses = courses.filter((course) => bookmarks.has(course.id));

  return {
    bookmarks,
    bookmarkedCourses,
    toggleBookmark,
  };
}
