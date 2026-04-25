import { ScrollView, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SafeScrollView({ children, className, ...props }: ScrollViewProps & { className?: string }) {
  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScrollView className={`flex-1 ${className ?? ""}`} contentContainerStyle={{ padding: 20 }} {...props}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
