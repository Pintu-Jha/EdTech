import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";

import type { Course } from "@/types/course.types";
import { BookmarkButton } from "@/components/course/BookmarkButton";
import { Badge } from "@/components/ui/Badge";

interface CourseCardProps {
  course: Course;
  onPress: () => void;
  onToggleBookmark: () => void;
}

function CourseCardBase({ course, onPress, onToggleBookmark }: CourseCardProps) {
  const isEnrolled = course.isEnrolled;

  return (
    <Pressable onPress={onPress} className="active:opacity-70">
      <View
        className="mb-3 overflow-hidden rounded-card bg-card"
        style={isEnrolled ? { borderLeftWidth: 2, borderLeftColor: "#6C63FF" } : undefined}
      >
        {/* Thumbnail */}
        <Image
          source={{ uri: course.thumbnail }}
          style={{ width: "100%", aspectRatio: 16 / 9 }}
          contentFit="cover"
          placeholder={{ blurhash: "L6PZfSjE.AyE_3t7t7R**0o#DgR4" }}
          transition={300}
        />

        {/* Body */}
        <View className="p-3">
          <Text className="text-sm font-semibold text-primary" numberOfLines={2}>
            {course.title}
          </Text>

          {/* Instructor row */}
          <View className="mt-1.5 flex-row items-center gap-1.5">
            {course.instructor.avatar ? (
              <Image
                source={{ uri: course.instructor.avatar }}
                style={{ width: 20, height: 20, borderRadius: 10 }}
                contentFit="cover"
              />
            ) : (
              <View className="h-5 w-5 items-center justify-center rounded-full bg-elevated">
                <Feather name="user" size={10} color="#8892A4" />
              </View>
            )}
            <Text className="text-[11px] text-secondary">{course.instructor.name}</Text>
          </View>

          {/* Footer */}
          <View className="mt-2 flex-row items-center justify-between">
            <Badge label={course.category} />
            <BookmarkButton isBookmarked={course.isBookmarked} onPress={onToggleBookmark} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export const CourseCard = memo(
  CourseCardBase,
  (prev, next) =>
    prev.course.id === next.course.id &&
    prev.course.isBookmarked === next.course.isBookmarked &&
    prev.course.isEnrolled === next.course.isEnrolled &&
    prev.course.title === next.course.title &&
    prev.course.description === next.course.description,
);
