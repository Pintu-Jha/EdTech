import type { RawProduct, RawUser } from "@/types/api.types";
import type { Course } from "@/types/course.types";
import type { Instructor, User } from "@/types/user.types";

export function mapApiUserToUser(rawUser: {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}): User {
  return {
    id: rawUser._id,
    name: rawUser.username,
    email: rawUser.email,
    avatar: rawUser.avatar,
  };
}

export function mapRawUserToInstructor(rawUser: RawUser): Instructor {
  const middleName = rawUser.maidenName ? ` ${rawUser.maidenName}` : "";
  const name = `${rawUser.firstName}${middleName} ${rawUser.lastName}`.trim();

  return {
    id: String(rawUser.id),
    name,
    avatar: rawUser.image,
  };
}

export function mapProductToCourse(product: RawProduct, instructor: RawUser): Course {
  return {
    id: String(product.id),
    title: product.title,
    description: product.description,
    thumbnail: product.thumbnail,
    price: product.price,
    category: product.category,
    instructor: mapRawUserToInstructor(instructor),
    isBookmarked: false,
    isEnrolled: false,
  };
}
