import * as Notifications from "expo-notifications";

import { storageService } from "@/services/storageService";
import { STORAGE_KEYS } from "@/utils/constants";

type NotificationPermissionStatus = "granted" | "denied" | "undetermined";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function getPermissionStatus(): NotificationPermissionStatus {
  const raw = storageService.getString(STORAGE_KEYS.notificationPermissionStatus);
  if (raw === "granted" || raw === "denied" || raw === "undetermined") {
    return raw;
  }
  return "undetermined";
}

function setPermissionStatus(status: NotificationPermissionStatus): void {
  storageService.setString(STORAGE_KEYS.notificationPermissionStatus, status);
}

export const notificationService = {
  async ensurePermissions(): Promise<{ granted: boolean; shouldOpenSettings: boolean }> {
    const cachedStatus = getPermissionStatus();
    if (cachedStatus === "denied") {
      return { granted: false, shouldOpenSettings: true };
    }

    const current = await Notifications.getPermissionsAsync();
    if (current.granted) {
      setPermissionStatus("granted");
      return { granted: true, shouldOpenSettings: false };
    }

    const requested = await Notifications.requestPermissionsAsync();
    if (requested.granted) {
      setPermissionStatus("granted");
      return { granted: true, shouldOpenSettings: false };
    }

    setPermissionStatus("denied");
    return { granted: false, shouldOpenSettings: true };
  },

  async scheduleBookmarkMilestone(count: number): Promise<void> {
    const granted = getPermissionStatus() === "granted";
    if (!granted || count <= 0 || count % 5 !== 0) return;

    const lastMilestone = storageService.getNumber(STORAGE_KEYS.bookmarkMilestoneCount) ?? 0;
    if (count <= lastMilestone) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Nice progress!",
        body: `You've bookmarked ${count} courses! Ready to start learning?`,
      },
      trigger: null,
    });

    storageService.setNumber(STORAGE_KEYS.bookmarkMilestoneCount, count);
  },

  async handleAppOpenReengagement(): Promise<void> {
    const granted = getPermissionStatus() === "granted";
    const now = Date.now();
    const previous = storageService.getNumber(STORAGE_KEYS.lastAppOpenTimestamp);

    if (granted && typeof previous === "number") {
      const diff = now - previous;
      if (diff > 24 * 60 * 60 * 1000) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Come back and learn",
            body: "Pick up where you left off - your courses are waiting.",
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 1 },
        });
      }
    }

    storageService.setNumber(STORAGE_KEYS.lastAppOpenTimestamp, now);
  },
};
