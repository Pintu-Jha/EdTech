import { z } from "zod";

export const loginPayloadSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6),
});

export const registerPayloadSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").trim(),
  email: z.string().email().trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.literal("USER"),
});

export const rawProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  brand: z.string(),
  category: z.string(),
  thumbnail: z.string(),
  images: z.array(z.string()),
}).transform((val) => ({
  ...val,
  thumbnail: `https://picsum.photos/seed/course_${val.id}/400/300`,
  images: val.images.map((img, i) => `https://picsum.photos/seed/course_${val.id}_${i}/800/600`),
}));

export const randomProductsPayloadSchema = z.object({
  data: z.array(rawProductSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
}).transform((val) => ({
  products: val.data,
  totalProducts: val.totalItems,
  currentPage: val.page,
  limit: val.limit,
}));

export const rawUserSchema = z.object({
  id: z.number(),
  name: z.object({
    first: z.string(),
    last: z.string(),
  }),
  email: z.string().email(),
  picture: z.object({
    large: z.string(),
  }).optional(),
}).transform((val) => ({
  id: val.id,
  firstName: val.name.first,
  lastName: val.name.last,
  email: val.email,
  image: val.picture?.large,
}));

export const randomUsersPayloadSchema = z.object({
  data: z.array(rawUserSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
}).transform((val) => ({
  users: val.data,
  totalUsers: val.totalItems,
  currentPage: val.page,
  limit: val.limit,
}));

export const currentUserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.string(),
  avatar: z.union([z.string(), z.object({ url: z.string() }).passthrough()]).optional(),
}).transform((val) => ({
  _id: val._id,
  username: val.username,
  email: val.email,
  role: val.role,
  avatar: typeof val.avatar === "object" ? val.avatar?.url : val.avatar,
}));

export const authDataSchema = z.object({
  accessToken: z.string().optional(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  user: currentUserSchema,
}).transform((data) => ({
  ...data,
  token: data.accessToken || data.token || "",
  user: data.user,
}));

export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string(),
    success: z.boolean(),
  });
