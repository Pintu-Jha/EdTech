import { apiClient } from "@/api/client";
import { logger } from "@/utils/logger";
import type { ApiResponse, RandomProductsPayload } from "@/types/api.types";
import { apiResponseSchema, randomProductsPayloadSchema } from "@/utils/validators";

const coursesResponseSchema = apiResponseSchema(randomProductsPayloadSchema);

export interface FetchCoursesParams {
  page?: number;
  limit?: number;
  inc?: string;
  query?: string;
}

export async function fetchCourses(params: FetchCoursesParams = {}): Promise<ApiResponse<RandomProductsPayload>> {
  try {
    const response = await apiClient.get<ApiResponse<RandomProductsPayload>>("/api/v1/public/randomproducts", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        query: params.query,
      },
    });

    const parsedData = coursesResponseSchema.parse(response.data);
    return parsedData;
  } catch (error) {
    logger.error("[COURSES API] Failed to fetch or parse random products", error);
    throw error;
  }
}
