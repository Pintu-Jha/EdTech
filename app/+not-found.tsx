import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-canvas px-6">
      <Feather name="alert-circle" size={44} color="#2D3A52" />
      <Text className="mt-4 text-base font-semibold text-primary">Page not found</Text>
      <Text className="mt-1.5 max-w-[220px] text-center text-[13px] leading-5 text-secondary">
        The page you're looking for doesn't exist.
      </Text>
      <Link href="/" className="mt-5 text-sm font-semibold text-accent">
        Go back home
      </Link>
    </View>
  );
}
