import { useEffect } from "react";
import { AppState, Alert, Linking } from "react-native";

import { notificationService } from "@/services/notificationService";

export function useNotifications() {
  useEffect(() => {
    void (async () => {
      const result = await notificationService.ensurePermissions();
      if (result.shouldOpenSettings) {
        Alert.alert(
          "Notifications disabled",
          "Enable notifications from settings to receive learning reminders.",
          [
            { text: "Not now", style: "cancel" },
            {
              text: "Open settings",
              onPress: () => {
                void Linking.openSettings();
              },
            },
          ],
        );
      }
    })();
  }, []);

  useEffect(() => {
    void notificationService.handleAppOpenReengagement();

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void notificationService.handleAppOpenReengagement();
      }
    });

    return () => subscription.remove();
  }, []);
}
