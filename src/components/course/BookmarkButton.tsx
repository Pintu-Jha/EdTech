import { memo } from "react";
import { Pressable } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onPress: () => void;
  size?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const BookmarkButton = memo(function BookmarkButton({
  isBookmarked,
  onPress,
  size = 22,
}: BookmarkButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.8, { damping: 4, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 6, stiffness: 200 });
    });
    onPress();
  };

  return (
    <AnimatedPressable onPress={handlePress} hitSlop={8} style={animatedStyle}>
      {isBookmarked ? (
        <Ionicons name="bookmark" size={size} color="#6C63FF" />
      ) : (
        <Feather name="bookmark" size={size} color="#4E5A6E" />
      )}
    </AnimatedPressable>
  );
});
