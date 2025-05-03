import { PostInstagramRapid } from "../../types/post-instagram-rapid";
import { request } from "../api";
import { generateUrl } from "../url";

export const scrapingUserInstagram = async (
  username: string
): Promise<{ data: PostInstagramRapid[] }> => {
  return await request(generateUrl(`user-instagram/${username}/post`), {
    method: "GET",
  });
};
