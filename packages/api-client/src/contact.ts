import type { ApiResponse, ContactFormData } from "@repo/types";
import { fetcher } from "./fetcher";

export async function submitContactForm(data: ContactFormData): Promise<ApiResponse> {
  return fetcher("/api/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
