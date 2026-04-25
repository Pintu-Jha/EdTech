import { Feather } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CourseCard } from "@/components/course/CourseCard";
import { CourseCardSkeleton } from "@/components/course/CourseCardSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { COLORS } from "@/utils/constants";

export default function HomeScreen() {
  const { user } = useAuth();
  const {
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
  } = useCourses();
  const [searchInput, setSearchInput] = useState(searchQuery);
  const router = useRouter();

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    const id = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => clearTimeout(id);
  }, [searchInput, setSearchQuery]);

  const firstName = user?.name?.split(" ")[0] ?? "Learner";

  const emptyText = useMemo(() => {
    if (isLoading) return "";
    if (searchQuery.trim()) return "No results for this search.";
    return "No courses available yet.";
  }, [isLoading, searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="px-5 pb-1 pt-4">
        <Text className="text-xl font-bold text-primary">
          Hii, {firstName}
        </Text>
        <Text className="mt-0.5 text-[13px] text-secondary">
          What will you learn today?
        </Text>
      </View>

      <View className="mx-5 mt-3 mb-1 flex-row items-center rounded-full bg-elevated px-4 py-2.5">
        <Feather name="search" size={16} color="#4E5A6E" />
        <TextInput
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder="Search courses, category, instructor"
          placeholderTextColor="#4E5A6E"
          className="ml-2.5 flex-1 text-[13px] text-primary"
        />
        {searchInput.length > 0 ? (
          <Pressable onPress={() => setSearchInput("")} hitSlop={8}>
            <Feather name="x" size={14} color="#4E5A6E" />
          </Pressable>
        ) : null}
      </View>

      <Text className="mb-2 mt-2 px-5 text-[10px] font-semibold uppercase tracking-wider text-muted">
        All Courses
      </Text>

      <LegendList
        data={filteredCourses}
        estimatedItemSize={280}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        onEndReached={() => void loadMoreCourses()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void refreshCourses()}
            tintColor={COLORS.accent}
          />
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View className="py-6">
              <ActivityIndicator size="small" color={COLORS.accent} />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => router.push(`/course/${item.id}`)}
            onToggleBookmark={() => toggleBookmark(item.id)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View>
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </View>
          ) : (
            <View className="items-center justify-center py-16">
              <Feather name="book-open" size={44} color="#2D3A52" />
              <Text className="mt-4 text-base font-semibold text-primary">{emptyText}</Text>
            </View>
          )
        }
      />

      {error ? (
        <View className="absolute inset-x-5 top-36 rounded-card bg-card p-4">
          <Text className="text-sm text-error">{error}</Text>
          <Pressable
            onPress={() => void fetchCourses()}
            className="mt-3 self-start rounded-btn bg-accent px-4 py-2"
          >
            <Text className="text-xs font-semibold text-white">Retry</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
