import { Text, View } from "react-native";

interface BadgeProps {
  label: string;
  variant?: "accent" | "success";
}

export function Badge({ label, variant = "accent" }: BadgeProps) {
  const bgClass = variant === "success" ? "bg-success/20" : "bg-accent/10";
  const textClass = variant === "success" ? "text-success" : "text-accent";

  return (
    <View className={`self-start rounded-chip px-2 py-0.5 ${bgClass}`}>
      <Text className={`text-[10px] font-semibold uppercase tracking-wider ${textClass}`}>{label}</Text>
    </View>
  );
}
