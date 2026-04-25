import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: "bg-accent",
    text: "text-white",
  },
  secondary: {
    container: "border border-strong bg-transparent",
    text: "text-primary",
  },
  danger: {
    container: "bg-transparent",
    text: "text-error",
  },
  ghost: {
    container: "bg-transparent",
    text: "text-accent",
  },
};

export function Button({ label, variant = "primary", isLoading = false, disabled, ...props }: ButtonProps) {
  const styles = variantStyles[variant];

  return (
    <Pressable
      disabled={disabled || isLoading}
      className={`items-center justify-center rounded-btn px-4 py-3.5 ${styles.container} ${
        disabled || isLoading ? "opacity-50" : "active:scale-[0.97] active:opacity-85"
      }`}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variant === "primary" ? "#FFFFFF" : "#6C63FF"} />
      ) : (
        <Text className={`text-sm font-semibold ${styles.text}`}>{label}</Text>
      )}
    </Pressable>
  );
}
