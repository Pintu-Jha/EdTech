import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface WebViewErrorFallbackProps {
  message?: string;
  onReload: () => void;
}

export function WebViewErrorFallback({ message, onReload }: WebViewErrorFallbackProps) {
  return (
    <View className="flex-1 items-center justify-center bg-canvas px-6">
      <Feather name="alert-circle" size={44} color="#2D3A52" />
      <Text className="mt-4 text-base font-semibold text-primary">
        Content Unavailable
      </Text>
      <Text className="mt-1.5 max-w-[220px] text-center text-[13px] leading-5 text-secondary">
        {message ?? "Unable to load web content."}
      </Text>
      <Pressable onPress={onReload} className="mt-5 rounded-btn bg-accent px-5 py-2.5">
        <Text className="text-sm font-semibold text-white">Reload</Text>
      </Pressable>
    </View>
  );
}
