import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {
  const { isAuthenticated, hasRestoredSession } = useAuth();

  if (hasRestoredSession && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
