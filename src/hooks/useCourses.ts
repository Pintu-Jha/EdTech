import { useCourseStore } from "@/stores/courseStore";

export function useCourses() {
  const courses = useCourseStore((state) => state.courses);
  const filteredCourses = useCourseStore((state) => state.getFilteredCourses());
  const searchQuery = useCourseStore((state) => state.searchQuery);
  const isLoading = useCourseStore((state) => state.isLoading);
  const isRefreshing = useCourseStore((state) => state.isRefreshing);
  const isLoadingMore = useCourseStore((state) => state.isLoadingMore);
  const error = useCourseStore((state) => state.error);
  const fetchCourses = useCourseStore((state) => state.fetchCourses);
  const refreshCourses = useCourseStore((state) => state.refreshCourses);
  const loadMoreCourses = useCourseStore((state) => state.loadMoreCourses);
  const setSearchQuery = useCourseStore((state) => state.setSearchQuery);
  const toggleBookmark = useCourseStore((state) => state.toggleBookmark);

  return {
    courses,
    filteredCourses,
    searchQuery,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    fetchCourses,
    refreshCourses,
    loadMoreCourses,
    setSearchQuery,
    toggleBookmark,
  };
}
