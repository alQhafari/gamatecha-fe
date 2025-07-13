import { generateUrl } from "@/src/services/url";
import { BaseApiResponse } from "../../types/api";
import { User } from "../../types/user";
import { request } from "../api";

export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}): Promise<BaseApiResponse<User>> => {
  return await request(generateUrl("users"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};
