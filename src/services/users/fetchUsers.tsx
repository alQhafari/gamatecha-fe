import { BasePaginatedApiResponse } from "../../types/api";
import { User } from "../../types/user";
import { request } from "../api";
import { generateUrl } from "../url";

export const fetchUsers = async (queryParams: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<BasePaginatedApiResponse<User>> => {
  return await request(generateUrl(`users`, queryParams), {
    method: "GET",
  });
};
