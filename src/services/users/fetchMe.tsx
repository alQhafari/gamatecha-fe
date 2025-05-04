import { BaseApiResponse } from "../../types/api";
import { User } from "../../types/user";
import { request } from "../api";
import { generateUrl } from "../url";

export const fetchMe = async (
  token: string
): Promise<BaseApiResponse<User>> => {
  return await request(generateUrl("auth/me"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
