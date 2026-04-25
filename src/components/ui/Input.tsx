import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderClass = error
    ? "border-error"
    : isFocused
      ? "border-accent"
      : "border-subtle";

  return (
    <View>
      {label ? (
        <Text className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-secondary">
          {label}
        </Text>
      ) : null}
      <TextInput
        {...props}
        placeholderTextColor="#4E5A6E"
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className={`rounded-input border bg-inputbg px-3.5 py-3 text-sm text-primary ${borderClass} ${className ?? ""}`}
      />
      {error ? <Text className="mt-1 text-[11px] text-error">{error}</Text> : null}
    </View>
  );
}
