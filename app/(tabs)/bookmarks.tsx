import { Feather } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CourseCard } from "@/components/course/CourseCard";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function BookmarksScreen() {
  const router = useRouter();
  const { bookmarkedCourses, toggleBookmark } = useBookmarks();

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="px-5 pt-4">
        <Text className="text-xl font-bold text-primary">Saved Courses</Text>
        <Text className="mt-1 text-[13px] text-secondary">
          {bookmarkedCourses.length} courses saved
        </Text>
      </View>

      <LegendList
        data={bookmarkedCourses}
        estimatedItemSize={280}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12 }}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => router.push(`/course/${item.id}`)}
            onToggleBookmark={() => toggleBookmark(item.id)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Feather name="bookmark" size={44} color="#2D3A52" />
            <Text className="mt-4 text-base font-semibold text-primary">Nothing saved yet</Text>
            <Text className="mt-1.5 max-w-[220px] text-center text-[13px] leading-5 text-secondary">
              Tap on any course to save it here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
