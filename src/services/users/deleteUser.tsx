import { generateUrl } from "@/src/services/url";
import { BaseApiResponse } from "../../types/api";
import { request } from "../api";

export const deleteUser = async (
  id: number
): Promise<BaseApiResponse<null>> => {
  return await request(generateUrl(`users/${id}`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await request(`users/${id}`, {
    method: "DELETE",
  });
};
