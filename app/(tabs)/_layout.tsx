import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { useAuth } from "@/hooks/useAuth";
import { COLORS } from "@/utils/constants";

export default function TabsLayout() {
  const { isAuthenticated, hasRestoredSession } = useAuth();

  if (hasRestoredSession && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ErrorBoundary>
      <View className="flex-1 bg-canvas">
        <OfflineBanner />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: COLORS.elevated,
              borderTopColor: COLORS.borderSubtle,
              borderTopWidth: 1,
              height: 56,
              paddingBottom: 6,
              paddingTop: 6,
            },
            tabBarActiveTintColor: COLORS.accent,
            tabBarInactiveTintColor: COLORS.textMuted,
            tabBarLabelStyle: {
              fontSize: 9,
              fontWeight: "600",
              textTransform: "uppercase",
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => <Feather name="book-open" size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="bookmarks"
            options={{
              title: "Bookmarks",
              tabBarIcon: ({ color, size }) => <Feather name="bookmark" size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
            }}
          />
        </Tabs>
      </View>
    </ErrorBoundary>
  );
}
