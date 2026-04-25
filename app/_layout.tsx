import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuthBootstrap } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";

export default function RootLayout() {
  useNotifications();
  const { isBootstrapping } = useAuthBootstrap();

  if (isBootstrapping) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-6">
        <View className="h-12 w-12 items-center justify-center rounded-btn bg-accent">
          <Text className="text-lg font-bold text-white">L</Text>
        </View>
        <Text className="mt-4 text-sm font-medium text-secondary">Restoring session...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0D0F14" } }} />
    </SafeAreaProvider>
  );
}
