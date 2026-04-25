import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";
import { logger } from "@/utils/logger";
import { loginPayloadSchema } from "@/utils/validators";

type LoginFormValues = {
  email: string;
  password: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Login failed. Please try again.";
}

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginPayloadSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await login(values.email, values.password);
      router.replace("/(tabs)");
    } catch (error: unknown) {
      logger.error("[LOGIN] Error caught in UI:", error);
      setSubmitError(getErrorMessage(error));
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5">
        {/* Logo */}
        <View className="items-center">
          <View className="h-10 w-10 items-center justify-center rounded-btn bg-accent">
            <Text className="text-lg font-bold text-white">L</Text>
          </View>
          <Text className="mt-3 text-2xl font-bold text-primary">LearnSpace</Text>
          <Text className="mt-1 text-[13px] text-secondary">Learn at your own pace</Text>
        </View>

        {/* Toggle tabs */}
        <View className="mt-8 flex-row rounded-btn bg-card p-1">
          <View className="flex-1 rounded-[10px] bg-elevated py-2.5">
            <Text className="text-center text-[13px] font-semibold text-primary">Login</Text>
          </View>
          <Link href="/(auth)/register" asChild>
            <Pressable className="flex-1 py-2.5">
              <Text className="text-center text-[13px] text-secondary">Register</Text>
            </Pressable>
          </Link>
        </View>

        {/* Form card */}
        <View className="mt-4 rounded-card bg-card p-5">
          <View className="gap-4">
            <View>
              <Text className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-secondary">
                Email
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="you@example.com"
                    placeholderTextColor="#4E5A6E"
                    className="rounded-input border border-subtle bg-inputbg px-3.5 py-3 text-sm text-primary"
                  />
                )}
              />
              {errors.email?.message ? (
                <Text className="mt-1 text-[11px] text-error">{errors.email.message}</Text>
              ) : null}
            </View>

            <View>
              <Text className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-secondary">
                Password
              </Text>
              <View className="flex-row items-center rounded-input border border-subtle bg-inputbg px-3.5">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your password"
                      placeholderTextColor="#4E5A6E"
                      className="flex-1 py-3 text-sm text-primary"
                    />
                  )}
                />
                <Pressable onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#8892A4" />
                </Pressable>
              </View>
              {errors.password?.message ? (
                <Text className="mt-1 text-[11px] text-error">{errors.password.message}</Text>
              ) : null}
            </View>
          </View>

          {submitError ? (
            <Text className="mt-3 text-[11px] text-error">{submitError}</Text>
          ) : null}

          <Pressable
            onPress={() => void onSubmit()}
            disabled={isLoading}
            className={`mt-4 items-center rounded-btn py-3.5 ${isLoading ? "bg-accent/50" : "bg-accent active:scale-[0.97] active:opacity-85"}`}
          >
            <Text className="text-sm font-semibold text-white">
              {isLoading ? "Signing in..." : "Sign In"}
            </Text>
          </Pressable>
        </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
