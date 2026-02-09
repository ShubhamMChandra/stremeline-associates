export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  service?: string;
  message: string;
}

export interface NewsletterData {
  email: string;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}
