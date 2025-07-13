import { generateUrl } from "@/src/services/url";
import { BaseApiResponse } from "../../types/api";
import { User } from "../../types/user";
import { request } from "../api";

export const updateUser = async (
  id: number,
  userData: {
    username?: string;
    email?: string;
    password?: string;
    isAdmin?: boolean;
  }
): Promise<BaseApiResponse<User>> => {
  // Filter out empty password field for updates
  const filteredData = Object.fromEntries(
    Object.entries(userData).filter(([key, value]) => {
      if (key === "password" && (!value || value === "")) {
        return false;
      }
      return true;
    })
  );

  return await request(generateUrl(`users/${id}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filteredData),
  });
};
