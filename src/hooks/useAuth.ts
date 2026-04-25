import { useEffect } from "react";

import { useAuthStore } from "@/stores/authStore";
import type { RegisterPayload } from "@/types/api.types";
import type { User } from "@/types/user.types";

interface UseAuthResult {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRestoredSession: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hasRestoredSession = useAuthStore((state) => state.hasRestoredSession);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    hasRestoredSession,
    login,
    register,
    logout,
    restoreSession,
    updateProfile,
  };
}

export function useAuthBootstrap(): { isBootstrapping: boolean } {
  const hasRestoredSession = useAuthStore((state) => state.hasRestoredSession);
  const isLoading = useAuthStore((state) => state.isLoading);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    if (hasRestoredSession || isLoading) return;
    void restoreSession();
  }, [hasRestoredSession, isLoading, restoreSession]);

  return { isBootstrapping: !hasRestoredSession || isLoading };
}
