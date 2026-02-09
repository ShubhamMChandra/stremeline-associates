export interface Service {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  label: string;
  useCases: string[];
}

export interface UseCase {
  slug: string;
  title: string;
  description: string;
  icon: string;
  relatedServices: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  problem: string;
  solution: string;
  results: CaseStudyResult[];
  testimonial?: Testimonial;
  publishedAt: string;
}

export interface CaseStudyResult {
  metric: string;
  before?: string;
  after: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  image?: string;
  featured?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  credentials: string[];
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
