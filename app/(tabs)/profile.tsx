import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { Alert, Pressable, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";
import { useBookmarks } from "@/hooks/useBookmarks";
import { storageService } from "@/services/storageService";
import { COLORS, STORAGE_KEYS } from "@/utils/constants";

function getEnrolledCount(): number {
  const raw = storageService.getString(STORAGE_KEYS.enrolledCourseIds);
  if (!raw) return 0;
  try {
    const parsed = JSON.parse(raw) as string[];
    return parsed.length;
  } catch {
    return 0;
  }
}

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useAuth();
  const { bookmarkedCourses } = useBookmarks();
  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const onSaveName = async () => {
    try {
      await updateProfile({ name: displayName.trim() || user?.name });
      setSaveMessage("Profile updated.");
      setShowEditProfile(false);
    } catch {
      setSaveMessage("Failed to update profile.");
    }
  };

  const onLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          void logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="items-center rounded-b-[20px] bg-card px-5 pb-6 pt-6">
        <Pressable className="active:opacity-80">
          {user?.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                borderWidth: 2,
                borderColor: COLORS.accent,
              }}
              contentFit="cover"
            />
          ) : (
            <View
              className="items-center justify-center rounded-full bg-elevated"
              style={{
                width: 72,
                height: 72,
                borderWidth: 2,
                borderColor: COLORS.accent,
                borderRadius: 36,
              }}
            >
              <Feather name="user" size={28} color="#8892A4" />
            </View>
          )}
        </Pressable>
        <Text className="mt-2.5 text-lg font-bold text-primary">
          {user?.name ?? "Learner"}
        </Text>
        <Text className="mt-0.5 text-xs text-secondary">
          {user?.email ?? "No email"}
        </Text>
      </View>

      <View className="mx-5 mt-4 flex-row gap-3">
        <View className="flex-1 items-center rounded-btn bg-card p-3.5">
          <Text className="text-2xl font-bold text-accent">{getEnrolledCount()}</Text>
          <Text className="mt-0.5 text-[9px] font-semibold uppercase text-muted">Enrolled</Text>
        </View>
        <View className="flex-1 items-center rounded-btn bg-card p-3.5">
          <Text className="text-2xl font-bold text-accent">{bookmarkedCourses.length}</Text>
          <Text className="mt-0.5 text-[9px] font-semibold uppercase text-muted">Bookmarked</Text>
        </View>
      </View>

      <View className="mt-6">
        <Text className="mb-2 px-5 text-[10px] font-semibold uppercase tracking-wider text-muted">
          Account
        </Text>

        <Pressable
          onPress={() => setShowEditProfile(!showEditProfile)}
          className="flex-row items-center bg-card px-5 py-3.5"
          style={{ borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle }}
        >
          <Feather name="user" size={16} color="#8892A4" />
          <Text className="ml-2.5 flex-1 text-[13px] font-medium text-primary">Edit Profile</Text>
          <Feather name="chevron-right" size={14} color="#2D3A52" />
        </Pressable>

        {showEditProfile ? (
          <View className="bg-card px-5 py-3" style={{ borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle }}>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              className="rounded-input border border-subtle bg-inputbg px-3.5 py-2.5 text-sm text-primary"
              placeholder="Enter display name"
              placeholderTextColor="#4E5A6E"
            />
            <Pressable
              onPress={() => void onSaveName()}
              className="mt-2.5 items-center rounded-btn bg-accent py-2.5"
            >
              <Text className="text-sm font-semibold text-white">Save</Text>
            </Pressable>
            {saveMessage ? (
              <Text className="mt-1.5 text-[11px] text-secondary">{saveMessage}</Text>
            ) : null}
          </View>
        ) : null}

        <View
          className="flex-row items-center bg-card px-5 py-3.5"
          style={{ borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle }}
        >
          <Feather name="bell" size={16} color="#8892A4" />
          <Text className="ml-2.5 flex-1 text-[13px] font-medium text-primary">Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: COLORS.borderStrong, true: COLORS.accent }}
            thumbColor="#FFFFFF"
          />
        </View>

        <Pressable
          onPress={onLogout}
          className="flex-row items-center bg-card px-5 py-3.5"
        >
          <Feather name="log-out" size={16} color="#F87171" />
          <Text className="ml-2.5 text-[13px] font-medium text-error">Log Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
