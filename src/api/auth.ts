import { apiClient } from "@/api/client";
import type { ApiResponse, AuthData, LoginPayload, RegisterPayload } from "@/types/api.types";
import { apiResponseSchema, authDataSchema, loginPayloadSchema, registerPayloadSchema } from "@/utils/validators";

const authResponseSchema = apiResponseSchema(authDataSchema);

export async function login(payload: LoginPayload): Promise<ApiResponse<AuthData>> {
  const parsedPayload = loginPayloadSchema.parse(payload);
  const response = await apiClient.post<ApiResponse<AuthData>>("/api/v1/users/login", parsedPayload);
  return authResponseSchema.parse(response.data);
}

export async function register(payload: RegisterPayload): Promise<ApiResponse<AuthData>> {
  const parsedPayload = registerPayloadSchema.parse(payload);
  const response = await apiClient.post<ApiResponse<AuthData>>("/api/v1/users/register", parsedPayload);
  return authResponseSchema.parse(response.data);
}
