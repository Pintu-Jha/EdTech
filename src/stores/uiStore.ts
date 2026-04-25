import { create } from "zustand";

type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface UiState {
  isGlobalLoading: boolean;
  toasts: ToastMessage[];
  setGlobalLoading: (isLoading: boolean) => void;
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isGlobalLoading: false,
  toasts: [],

  setGlobalLoading(isLoading) {
    set({ isGlobalLoading: isLoading });
  },

  showToast(message, type = "info") {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
  },

  dismissToast(id) {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts() {
    set({ toasts: [] });
  },
}));
