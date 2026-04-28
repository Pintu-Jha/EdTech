import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";
import { useUiStore } from "@/stores/uiStore";
import { registerPayloadSchema } from "@/utils/validators";

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Registration failed. Please try again.";
}

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerPayloadSchema.omit({ role: true })),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await register({ ...values, role: "USER" });
      useUiStore.getState().showToast("Account created successfully", "success");
      router.replace("/(tabs)");
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setSubmitError(message);
      useUiStore.getState().showToast(message, "error");
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
        <View className="items-center">
          <View className="h-10 w-10 items-center justify-center rounded-btn bg-accent">
            <Text className="text-lg font-bold text-white">L</Text>
          </View>
          <Text className="mt-3 text-2xl font-bold text-primary">LearnSpace</Text>
          <Text className="mt-1 text-[13px] text-secondary">Start your learning journey</Text>
        </View>

        <View className="mt-8 flex-row rounded-btn bg-card p-1">
          <Link href="/(auth)/login" asChild>
            <Pressable className="flex-1 py-2.5">
              <Text className="text-center text-[13px] text-secondary">Login</Text>
            </Pressable>
          </Link>
          <View className="flex-1 rounded-[10px] bg-elevated py-2.5">
            <Text className="text-center text-[13px] font-semibold text-primary">Register</Text>
          </View>
        </View>

        <View className="mt-4 rounded-card bg-card p-5">
          <View className="gap-4">
            <View>
              <Text className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-secondary">
                Username
              </Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="johndoe"
                    placeholderTextColor="#4E5A6E"
                    className="rounded-input border border-subtle bg-inputbg px-3.5 py-3 text-sm text-primary"
                  />
                )}
              />
              {errors.username?.message ? (
                <Text className="mt-1 text-[11px] text-error">{errors.username.message}</Text>
              ) : null}
            </View>

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
                      placeholder="Minimum 6 characters"
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
              {isLoading ? "Creating account..." : "Create Account"}
            </Text>
          </Pressable>
        </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
