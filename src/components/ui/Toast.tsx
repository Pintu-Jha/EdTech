import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ToastMessage, useUiStore } from "@/stores/uiStore";

function ToastItem({ toast }: { toast: ToastMessage }) {
  const dismissToast = useUiStore((state) => state.dismissToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      dismissToast(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, dismissToast]);

  const bgClass =
    toast.type === "success"
      ? "bg-success/20 border-success/30"
      : toast.type === "error"
      ? "bg-error/20 border-error/30"
      : "bg-elevated border-subtle";

  const textClass =
    toast.type === "success"
      ? "text-success"
      : toast.type === "error"
      ? "text-error"
      : "text-primary";

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(300)}
      layout={Layout.springify()}
      className={`mb-2 w-full flex-row items-center justify-center rounded-btn border px-4 py-3 shadow-lg ${bgClass}`}
    >
      <Text className={`text-sm font-semibold ${textClass}`}>{toast.message}</Text>
    </Animated.View>
  );
}

export function ToastContainer() {
  const toasts = useUiStore((state) => state.toasts);
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View
      className="absolute left-0 right-0 z-50 px-6"
      style={{ top: Math.max(insets.top, 16) }}
      pointerEvents="box-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
}
