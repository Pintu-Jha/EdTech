import { View } from "react-native";

import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

export function CourseCardSkeleton() {
  return (
    <View className="mb-3 overflow-hidden rounded-card bg-card">
      {/* Thumbnail skeleton */}
      <SkeletonLoader className="w-full" style={{ aspectRatio: 16 / 9 }} />

      {/* Body */}
      <View className="p-3">
        <SkeletonLoader className="h-4 w-4/5 rounded" />
        <SkeletonLoader className="mt-2 h-3.5 w-3/5 rounded" />

        {/* Instructor row */}
        <View className="mt-2 flex-row items-center gap-2">
          <SkeletonLoader className="h-5 w-5 rounded-full" />
          <SkeletonLoader className="h-3 w-24 rounded" />
        </View>

        {/* Footer */}
        <View className="mt-2.5 flex-row items-center justify-between">
          <SkeletonLoader className="h-5 w-16 rounded-chip" />
          <SkeletonLoader className="h-6 w-6 rounded" />
        </View>
      </View>
    </View>
  );
}
