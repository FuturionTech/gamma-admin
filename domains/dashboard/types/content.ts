/**
 * Content Management Dashboard Types
 * These types define the structure for content domain metrics
 */

export interface ContentDomainMetrics {
  total: number;
  active: number;
  inactive: number;
  recentCount: number; // Created in last 30 days
  growthPercentage: number;
}

export interface ServicesMetrics extends ContentDomainMetrics {
  // Services-specific metrics
}

export interface SolutionsMetrics extends ContentDomainMetrics {
  totalFeatures: number;
  totalBenefits: number;
}

export interface BlogMetrics extends ContentDomainMetrics {
  published: number;
  draft: number;
  totalViews: number;
  averageViews: number;
}

export interface ProjectsMetrics extends ContentDomainMetrics {
  published: number;
  draft: number;
}

export interface TeamMetrics extends ContentDomainMetrics {
  // Team-specific metrics
}

export interface PartnersMetrics extends ContentDomainMetrics {
  // Partners-specific metrics
}

export interface ClientsMetrics extends ContentDomainMetrics {
  byIndustry: IndustryBreakdown[];
}

export interface CertificationsMetrics extends ContentDomainMetrics {
  // Certifications-specific metrics
}

export interface FAQsMetrics extends ContentDomainMetrics {
  byCategory: CategoryBreakdown[];
}

export interface CareersMetrics extends ContentDomainMetrics {
  openPositions: number;
}

export interface TestimonialsMetrics extends ContentDomainMetrics {
  averageRating: number;
  ratingDistribution: RatingDistribution[];
}

export interface StatsMetrics extends ContentDomainMetrics {
  totalValue: number;
}

export interface IndustryBreakdown {
  industry: string;
  count: number;
  percentage: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface DashboardOverview {
  services: ServicesMetrics;
  solutions: SolutionsMetrics;
  blog: BlogMetrics;
  projects: ProjectsMetrics;
  team: TeamMetrics;
  partners: PartnersMetrics;
  clients: ClientsMetrics;
  certifications: CertificationsMetrics;
  faqs: FAQsMetrics;
  careers: CareersMetrics;
  testimonials: TestimonialsMetrics;
  stats: StatsMetrics;
}

export interface RecentContentActivity {
  type: 'blog' | 'project' | 'service' | 'team' | 'solution' | 'partner' | 'client';
  id: string;
  title: string;
  status: string;
  created_at: string;
  icon: string;
  iconColor: string;
  route: string;
}

export interface ContentDistribution {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  route: string;
  badge?: string;
}
