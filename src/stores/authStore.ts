import { create } from "zustand";

import { register as registerRequest, login as loginRequest } from "@/api/auth";
import { registerApiAuthHandlers } from "@/api/client";
import { fetchCurrentUser } from "@/api/users";
import { secureStorageService } from "@/services/secureStorageService";
import { storageService } from "@/services/storageService";
import type { RegisterPayload } from "@/types/api.types";
import type { User } from "@/types/user.types";
import { STORAGE_KEYS } from "@/utils/constants";
import { mapApiUserToUser } from "@/utils/mappers";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRestoredSession: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

function setPersistedUser(user: User | null): void {
  if (!user) {
    storageService.delete(STORAGE_KEYS.authUser);
    return;
  }

  storageService.setString(STORAGE_KEYS.authUser, JSON.stringify(user));
}

function getPersistedUser(): User | null {
  const rawUser = storageService.getString(STORAGE_KEYS.authUser);
  if (!rawUser) return null;

  try {
    const parsed = JSON.parse(rawUser) as User;
    return parsed;
  } catch {
    storageService.delete(STORAGE_KEYS.authUser);
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getPersistedUser(),
  token: null,
  isLoading: false,
  isAuthenticated: false,
  hasRestoredSession: false,

  async login(email, password) {
    set({ isLoading: true });

    try {
      const response = await loginRequest({ email, password });
      const mappedUser = mapApiUserToUser(response.data.user);

      await secureStorageService.setItem(STORAGE_KEYS.authToken, response.data.token);
      if (response.data.refreshToken) {
        await secureStorageService.setItem(STORAGE_KEYS.refreshToken, response.data.refreshToken);
      }

      setPersistedUser(mappedUser);
      set({
        user: mappedUser,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
        hasRestoredSession: true,
      });
    } catch (error: unknown) {
      set({ isLoading: false });
      throw error;
    }
  },

  async register(payload) {
    set({ isLoading: true });

    try {
      await registerRequest(payload);
      
      // FreeAPI does not return auth tokens on register, so we automatically log the user in immediately after.
      await get().login(payload.email, payload.password);
    } catch (error: unknown) {
      set({ isLoading: false });
      throw error;
    }
  },

  async logout() {
    await secureStorageService.deleteItem(STORAGE_KEYS.authToken);
    await secureStorageService.deleteItem(STORAGE_KEYS.refreshToken);
    storageService.delete(STORAGE_KEYS.authUser);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      hasRestoredSession: true,
    });
  },

  async restoreSession() {
    set({ isLoading: true });

    try {
      const token = await secureStorageService.getItem(STORAGE_KEYS.authToken);
      if (!token) {
        set({ isLoading: false, token: null, user: null, isAuthenticated: false, hasRestoredSession: true });
        return;
      }

      const currentUserResponse = await fetchCurrentUser();
      const profile = currentUserResponse.data;
      const hydratedUser: User = {
        id: profile._id,
        name: profile.username,
        email: profile.email,
        avatar: profile.avatar,
      };

      setPersistedUser(hydratedUser);
      set({
        token,
        user: hydratedUser,
        isAuthenticated: true,
        isLoading: false,
        hasRestoredSession: true,
      });
    } catch {
      await get().logout();
    }
  },

  async updateProfile(data) {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...data,
    };

    setPersistedUser(updatedUser);
    set({ user: updatedUser });
  },
}));

registerApiAuthHandlers({
  getRefreshToken: () => secureStorageService.getItem(STORAGE_KEYS.refreshToken),
  onAuthFailure: () => useAuthStore.getState().logout(),
  onTokenUpdated: async (token) => {
    await secureStorageService.setItem(STORAGE_KEYS.authToken, token);
    useAuthStore.setState({ token, isAuthenticated: true });
  },
});
