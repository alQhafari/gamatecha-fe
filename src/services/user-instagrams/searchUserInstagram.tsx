import { UserInstagramRapid } from "../../types/user-instagram-rapid";
import { request } from "../api";
import { generateUrl } from "../url";

export const searchUserInstagram = async (
  username: string
): Promise<{ data: UserInstagramRapid[] }> => {
  return await request(
    generateUrl(`user-instagram/search?username=${username}`),
    {
      method: "GET",
    }
  );
};
