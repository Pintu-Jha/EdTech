import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import NetInfo from "@react-native-community/netinfo";

import type { ApiError, ApiResponse, AuthData } from "@/types/api.types";
import { secureStorageService } from "@/services/secureStorageService";
import { APP_CONFIG, STORAGE_KEYS } from "@/utils/constants";
import { logger } from "@/utils/logger";

type RequestMeta = {
  _retryCount?: number;
  _retryAuth?: boolean;
};

type ExtendedConfig = InternalAxiosRequestConfig & RequestMeta;

type AuthHandlers = {
  getRefreshToken?: () => Promise<string | null>;
  onAuthFailure?: () => Promise<void>;
  onTokenUpdated?: (token: string) => Promise<void>;
};

const RETRYABLE_STATUS_CODES = new Set([500, 502, 503, 504]);
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 500;

let authHandlers: AuthHandlers = {};
let refreshPromise: Promise<string | null> | null = null;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function toAppError(error: AxiosError): ApiError {
  const status = error.response?.status;
  const isTimeout = error.code === "ECONNABORTED";
  const isNetwork = error.code === "ERR_NETWORK" || !error.response;
  const isRetryable = isTimeout || isNetwork || (status ? RETRYABLE_STATUS_CODES.has(status) : false);

  const responseData = error.response?.data as any;
  const customMessage = responseData?.message;

  return {
    code: error.code ?? "UNKNOWN_ERROR",
    message: customMessage || error.message || "Something went wrong",
    isRetryable,
    status,
  };
}

function shouldRetry(error: AxiosError, config: ExtendedConfig): boolean {
  const appError = toAppError(error);
  const attempt = config._retryCount ?? 0;
  return appError.isRetryable && attempt < MAX_RETRIES;
}

async function refreshToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshTokenValue = await authHandlers.getRefreshToken?.();
      if (!refreshTokenValue) return null;

      const response = await axios.post<ApiResponse<AuthData>>(
        "/api/v1/users/refresh-token",
        { refreshToken: refreshTokenValue },
        {
          baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
          timeout: APP_CONFIG.apiTimeoutMs,
        },
      );

      const nextToken = response.data.data.token;
      await secureStorageService.setItem(STORAGE_KEYS.authToken, nextToken);
      if (authHandlers.onTokenUpdated) {
        await authHandlers.onTokenUpdated(nextToken);
      }

      return nextToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function requestWithRetry(error: AxiosError, api: AxiosInstance): Promise<unknown> {
  const config = error.config as ExtendedConfig | undefined;
  if (!config || !shouldRetry(error, config)) throw error;

  const nextAttempt = (config._retryCount ?? 0) + 1;
  config._retryCount = nextAttempt;
  await sleep(RETRY_BASE_DELAY_MS * 2 ** (nextAttempt - 1));
  return api.request(config as AxiosRequestConfig);
}

export function registerApiAuthHandlers(handlers: AuthHandlers): void {
  authHandlers = { ...authHandlers, ...handlers };
}

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: APP_CONFIG.apiTimeoutMs,
});

apiClient.interceptors.request.use(async (config) => {
  const nextConfig = config as ExtendedConfig;
  const netState = await NetInfo.fetch();
  const online = netState.isConnected !== false && netState.isInternetReachable !== false;
  if (!online) {
    throw new AxiosError("You are offline. Please check your internet connection.", "ERR_NETWORK", nextConfig);
  }

  const token = await secureStorageService.getItem(STORAGE_KEYS.authToken);

  if (token) {
    nextConfig.headers.Authorization = `Bearer ${token}`;
  }

  return nextConfig;
});

  apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    logger.error(`[API ERROR RAW] ${error.config?.method?.toUpperCase()} ${error.config?.url} =>`, error.response?.status, error.message);
    if (error.response?.data) {
      logger.error("[API ERROR DATA]:", JSON.stringify(error.response.data, null, 2));
    }

    const config = error.config as ExtendedConfig | undefined;
    if (!config) throw error;

    if (error.response?.status === 401 && !config._retryAuth) {
      config._retryAuth = true;
      const nextToken = await refreshToken();
      if (nextToken) {
        config.headers.Authorization = `Bearer ${nextToken}`;
        return apiClient.request(config as AxiosRequestConfig);
      }

      if (authHandlers.onAuthFailure) {
        await authHandlers.onAuthFailure();
      }
    }

    try {
      return await requestWithRetry(error, apiClient);
    } catch (retryError) {
      logger.error("[API ERROR RETRY FAILED]", retryError);
      throw toAppError(error);
    }
  },
);
