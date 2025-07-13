import { BasePaginatedApiResponse } from "@/src/types/api";
import { Article } from "@/src/types/article";
import { request } from "../api";
import { generateUrl } from "../url";

export const fetchArticles = async (
  page: number,
  search: string = ""
): Promise<BasePaginatedApiResponse<Article>> => {
  return await request(generateUrl(`articles`, { page, limit: 8, search }), {
    method: "GET",
  });
};
