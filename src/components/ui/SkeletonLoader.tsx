import { useEffect } from "react";
import { type ViewStyle, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";

interface SkeletonLoaderProps {
  className?: string;
  style?: ViewStyle;
}

export function SkeletonLoader({ className, style }: SkeletonLoaderProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false,
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.4, 0.7, 0.4]),
  }));

  return (
    <View className={`overflow-hidden rounded-md ${className ?? ""}`} style={style}>
      <Animated.View
        style={[{ backgroundColor: "#1E2535", width: "100%", height: "100%" }, animatedStyle]}
      />
    </View>
  );
}
