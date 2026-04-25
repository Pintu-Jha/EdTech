import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/ui/Badge";
import { BookmarkButton } from "@/components/course/BookmarkButton";
import { useCourseStore } from "@/stores/courseStore";
import { storageService } from "@/services/storageService";
import { STORAGE_KEYS } from "@/utils/constants";

function readEnrolledSet(): Set<string> {
  const raw = storageService.getString(STORAGE_KEYS.enrolledCourseIds);
  if (!raw) return new Set<string>();
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed as string[]);
    }
    return new Set<string>();
  } catch {
    storageService.delete(STORAGE_KEYS.enrolledCourseIds);
    return new Set<string>();
  }
}

function writeEnrolledSet(values: Set<string>): void {
  storageService.setString(STORAGE_KEYS.enrolledCourseIds, JSON.stringify([...values]));
}

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const course = useCourseStore((state) => state.courses.find((item) => item.id === id));
  const toggleBookmark = useCourseStore((state) => state.toggleBookmark);
  const [isEnrolled, setIsEnrolled] = useState(() => (typeof id === "string" ? readEnrolledSet().has(id) : false));
  const [showFullDescription, setShowFullDescription] = useState(false);
  const insets = useSafeAreaInsets();

  if (!course || typeof id !== "string") {
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-6">
        <Feather name="book-open" size={44} color="#2D3A52" />
        <Text className="mt-4 text-base font-semibold text-primary">Course not found</Text>
        <Pressable onPress={() => router.replace("/(tabs)")} className="mt-5">
          <Text className="text-sm font-semibold text-accent">Go to catalog</Text>
        </Pressable>
      </View>
    );
  }

  const onEnroll = () => {
    const next = readEnrolledSet();
    if (next.has(course.id)) {
      next.delete(course.id);
      setIsEnrolled(false);
    } else {
      next.add(course.id);
      setIsEnrolled(true);
    }
    writeEnrolledSet(next);
  };

  const priceLabel = course.price === 0 ? "Free" : `₹${course.price}`;

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero image */}
        <View>
          <Image
            source={{ uri: course.thumbnail }}
            style={{ width: "100%", aspectRatio: 16 / 9 }}
            contentFit="cover"
            placeholder={{ blurhash: "L6PZfSjE.AyE_3t7t7R**0o#DgR4" }}
            transition={300}
          />

          {/* Gradient overlay at bottom of hero */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
              backgroundColor: "transparent",
            }}
          >
            <View style={{ flex: 1, backgroundColor: "rgba(13, 15, 20, 0.0)" }} />
            <View style={{ flex: 1, backgroundColor: "rgba(13, 15, 20, 0.3)" }} />
            <View style={{ flex: 1, backgroundColor: "rgba(13, 15, 20, 0.6)" }} />
            <View style={{ flex: 1, backgroundColor: "rgba(13, 15, 20, 0.85)" }} />
          </View>

          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            className="absolute left-4 items-center justify-center rounded-full"
            style={{
              top: insets.top + 8,
              width: 36,
              height: 36,
              backgroundColor: "rgba(30, 37, 53, 0.8)",
            }}
          >
            <Feather name="arrow-left" size={18} color="#F0F2F8" />
          </Pressable>

          {/* Bookmark button */}
          <View
            className="absolute right-4 items-center justify-center rounded-full"
            style={{
              top: insets.top + 8,
              width: 36,
              height: 36,
              backgroundColor: "rgba(30, 37, 53, 0.8)",
            }}
          >
            <BookmarkButton
              isBookmarked={course.isBookmarked}
              onPress={() => toggleBookmark(course.id)}
              size={16}
            />
          </View>
        </View>

        {/* Content overlapping hero */}
        <View className="-mt-5 rounded-t-[20px] bg-canvas px-5 pt-5">
          {/* Badges row */}
          <View className="flex-row items-center gap-2">
            <Badge label={course.category} />
            {isEnrolled ? <Badge label="Enrolled ✓" variant="success" /> : null}
          </View>

          {/* Title */}
          <Text className="mt-2 text-xl font-bold text-primary">{course.title}</Text>

          {/* Price */}
          <Text className="mt-1.5 text-[22px] font-bold text-accent">{priceLabel}</Text>

          {/* Instructor card */}
          <View className="mt-3 flex-row items-center rounded-btn bg-card p-3">
            {course.instructor.avatar ? (
              <Image
                source={{ uri: course.instructor.avatar }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
                contentFit="cover"
              />
            ) : (
              <View className="h-9 w-9 items-center justify-center rounded-full bg-elevated">
                <Feather name="user" size={16} color="#8892A4" />
              </View>
            )}
            <View className="ml-3">
              <Text className="text-[13px] font-semibold text-primary">
                {course.instructor.name}
              </Text>
              <Text className="text-[11px] text-secondary">Instructor</Text>
            </View>
          </View>

          {/* Description */}
          <Text
            className="mt-3 text-[13px] leading-[22px] text-secondary"
            numberOfLines={showFullDescription ? undefined : 3}
          >
            {course.description}
          </Text>
          <Pressable onPress={() => setShowFullDescription(!showFullDescription)} className="mt-1">
            <Text className="text-[13px] font-semibold text-accent">
              {showFullDescription ? "Show less" : "Read more"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View
        className="flex-row items-center gap-3 border-t border-subtle bg-elevated px-5 py-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        {isEnrolled ? (
          <Pressable
            onPress={() => router.push(`/course/viewer?id=${course.id}`)}
            className="flex-1 items-center rounded-btn bg-accent py-3.5 active:scale-[0.97] active:opacity-85"
          >
            <Text className="text-sm font-semibold text-white">Continue Learning →</Text>
          </Pressable>
        ) : (
          <View className="flex-1 flex-row items-center gap-3">
            <Pressable
              onPress={() => router.push(`/course/viewer?id=${course.id}`)}
              className="flex-1 items-center rounded-btn border border-strong py-3.5 active:opacity-80"
            >
              <Text className="text-sm font-semibold text-primary">View Content</Text>
            </Pressable>
            <Pressable
              onPress={onEnroll}
              className="flex-1 items-center rounded-btn bg-accent py-3.5 active:scale-[0.97] active:opacity-85"
            >
              <Text className="text-sm font-semibold text-white">Enroll — {priceLabel}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
