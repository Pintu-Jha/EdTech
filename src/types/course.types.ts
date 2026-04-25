import type { Instructor } from "./user.types";

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  instructor: Instructor;
  isBookmarked: boolean;
  isEnrolled: boolean;
}
