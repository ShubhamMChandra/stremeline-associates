import type { ApiResponse, NewsletterData } from "@repo/types";
import { fetcher } from "./fetcher";

export async function subscribeNewsletter(data: NewsletterData): Promise<ApiResponse> {
  return fetcher("/api/newsletter", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
