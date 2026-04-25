import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CourseWebView } from "@/components/webview/CourseWebView";
import { storageService } from "@/services/storageService";
import { useCourseStore } from "@/stores/courseStore";
import { STORAGE_KEYS } from "@/utils/constants";

function readEnrolledSet(): Set<string> {
  const raw = storageService.getString(STORAGE_KEYS.enrolledCourseIds);
  if (!raw) return new Set<string>();
  try {
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    storageService.delete(STORAGE_KEYS.enrolledCourseIds);
    return new Set<string>();
  }
}

function writeEnrolledSet(values: Set<string>): void {
  storageService.setString(STORAGE_KEYS.enrolledCourseIds, JSON.stringify([...values]));
}

export default function CourseViewerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const course = useCourseStore((state) => state.courses.find((item) => item.id === id));
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  if (!course) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-6">
        <Feather name="book-open" size={44} color="#2D3A52" />
        <Text className="mt-4 text-base font-semibold text-primary">
          Course content is unavailable.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-canvas">
      <View
        className="flex-row items-center justify-between border-b border-subtle bg-elevated px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="h-8 w-8 items-center justify-center rounded-full"
          hitSlop={8}
        >
          <Feather name="arrow-left" size={20} color="#F0F2F8" />
        </Pressable>
        <Text className="max-w-[70%] text-center text-sm font-semibold text-primary" numberOfLines={1}>
          {course.title}
        </Text>
        <View className="w-8" />
      </View>

      {isLoading ? (
        <View className="h-0.5 w-full bg-border-subtle">
          <View
            className="h-full bg-accent"
            style={{ width: `${Math.max(loadProgress * 100, 6)}%` }}
          />
        </View>
      ) : null}

      <CourseWebView
        course={course}
        onProgress={(progress) => {
          setLoadProgress(progress);
          if (progress >= 1) {
            setIsLoading(false);
          }
        }}
        onEnroll={(courseId) => {
          const enrolled = readEnrolledSet();
          enrolled.add(courseId);
          writeEnrolledSet(enrolled);
        }}
      />
    </View>
  );
}
