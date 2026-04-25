import { useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

import type { Course } from "@/types/course.types";
import { courseTemplate } from "@/webview/courseTemplate";
import { WebViewErrorFallback } from "@/components/webview/WebViewErrorFallback";

interface WebViewMessage {
  type?: string;
  payload?: {
    courseId?: string;
  };
}

interface CourseWebViewProps {
  course: Course;
  onEnroll: (courseId: string) => void;
  onProgress?: (progress: number) => void;
}

export function CourseWebView({ course, onEnroll, onProgress }: CourseWebViewProps) {
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const html = useMemo(() => courseTemplate(course), [course]);

  const injectedPayload = useMemo(
    () =>
      `window.__COURSE_FROM_NATIVE__ = ${JSON.stringify({
        id: course.id,
        title: course.title,
      })}; true;`,
    [course.id, course.title],
  );

  if (error) {
    return (
      <WebViewErrorFallback
        message={error}
        onReload={() => {
          setError(null);
          setReloadKey((prev) => prev + 1);
        }}
      />
    );
  }

  return (
    <WebView
      key={reloadKey}
      source={{ html }}
      injectedJavaScriptBeforeContentLoaded={injectedPayload}
      onLoadProgress={({ nativeEvent }) => {
        onProgress?.(nativeEvent.progress);
      }}
      onMessage={(event) => {
        try {
          const parsed = JSON.parse(event.nativeEvent.data) as WebViewMessage;
          if (parsed.type === "ENROLL" && parsed.payload?.courseId) {
            onEnroll(parsed.payload.courseId);
          }
        } catch {
          // Ignore malformed webview messages from content
        }
      }}
      onError={() => {
        setError("Failed to load web content.");
      }}
      onHttpError={() => {
        setError("Web content responded with an error.");
      }}
      startInLoadingState
      renderLoading={() => (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      )}
    />
  );
}
