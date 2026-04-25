import { useEffect } from "react";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useNetwork } from "@/hooks/useNetwork";

export function OfflineBanner() {
  const { isConnected, isInternetReachable } = useNetwork();
  const offline = !isConnected || !isInternetReachable;
  const translateY = useSharedValue(-150);

  useEffect(() => {
    translateY.value = withTiming(offline ? 0 : -150, { duration: 250 });
  }, [offline, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={animatedStyle}
      className="absolute left-0 right-0 top-0 z-50 flex-row items-center justify-center gap-1.5 bg-warning px-5 pb-2 pt-14"
    >
      <Feather name="wifi-off" size={12} color="#0D0F14" />
      <Text className="text-[11px] font-semibold text-canvas">
        You are offline. Some content may be outdated.
      </Text>
    </Animated.View>
  );
}
