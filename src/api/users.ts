import { apiClient } from "@/api/client";
import { logger } from "@/utils/logger";
import type { ApiResponse, RandomUsersPayload } from "@/types/api.types";
import { apiResponseSchema, currentUserSchema, randomUsersPayloadSchema } from "@/utils/validators";

const usersResponseSchema = apiResponseSchema(randomUsersPayloadSchema);

export interface FetchInstructorsParams {
  page?: number;
  limit?: number;
}

export async function fetchInstructors(
  params: FetchInstructorsParams = {},
): Promise<ApiResponse<RandomUsersPayload>> {
  try {
    const response = await apiClient.get<ApiResponse<RandomUsersPayload>>("/api/v1/public/randomusers", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
    });

    const parsedData = usersResponseSchema.parse(response.data);
    return parsedData;
  } catch (error) {
    logger.error("[USERS API] Failed to fetch or parse random users", error);
    throw error;
  }
}

export async function fetchCurrentUser() {
  try {
    const response = await apiClient.get("/api/v1/users/current-user");
    const schema = apiResponseSchema(currentUserSchema);
    const parsedData = schema.parse(response.data);
    return parsedData;
  } catch (error) {
    logger.error("[USERS API] Failed to fetch or parse current user", error);
    throw error;
  }
}
