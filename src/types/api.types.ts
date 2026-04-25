export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  isRetryable: boolean;
  status?: number;
}

export interface RawProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface RawUser {
  id: number;
  firstName: string;
  maidenName?: string;
  lastName: string;
  email: string;
  image?: string;
}

export interface RandomProductsPayload {
  products: RawProduct[];
  totalProducts: number;
  currentPage: number;
  limit: number;
}

export interface RandomUsersPayload {
  users: RawUser[];
  totalUsers: number;
  currentPage: number;
  limit: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: "USER";
}

export interface AuthData {
  token: string;
  refreshToken?: string;
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    avatar?: string;
  };
}
