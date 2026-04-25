import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({
  id: "lms-storage",
});

export const storageService = {
  setString(key: string, value: string): void {
    storage.set(key, value);
  },

  getString(key: string): string | undefined {
    return storage.getString(key);
  },

  setBoolean(key: string, value: boolean): void {
    storage.set(key, value);
  },

  getBoolean(key: string): boolean | undefined {
    return storage.getBoolean(key);
  },

  setNumber(key: string, value: number): void {
    storage.set(key, value);
  },

  getNumber(key: string): number | undefined {
    return storage.getNumber(key);
  },

  delete(key: string): void {
    storage.remove(key);
  },

  clearAll(): void {
    storage.clearAll();
  },
};
