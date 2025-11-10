// Enhanced Dashboard Analytics Types
export interface PlatformStatistics {
  // Core platform metrics
  totalOrganizations: number;
  totalTenants: number;
  totalApplications: number;
  totalSubscriptions: number;
  totalRevenue: number;
  totalPayments: number;
  
  // Growth metrics
  organizationGrowth: GrowthMetric;
  tenantGrowth: GrowthMetric;
  applicationGrowth: GrowthMetric;
  subscriptionGrowth: GrowthMetric;
  revenueGrowth: GrowthMetric;
  
  // Revenue metrics
  monthlyRevenue: number;
  averageRevenuePerUser: number;
  paymentSuccessRate: number;
  
  // Engagement metrics
  totalContacts: number;
  totalDeployments: number;
  deploymentSuccessRate: number;
  averageDeploymentTime: number;
  
  // Geographic distribution
  topCountries: CountryMetric[];
  
  // Business intelligence
  topIndustries: IndustryMetric[];
  planDistribution: PlanDistributionMetric[];
  
  // System health
  systemHealth: SystemHealthMetrics;
}

export interface GrowthMetric {
  current: number;
  previous: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SystemHealthMetrics {
  deploymentService: ServiceStatus;
  emailService: ServiceStatus;
  databaseService: ServiceStatus;
  overallScore: number;
}

export interface ServiceStatus {
  status: 'online' | 'degraded' | 'offline';
  responseTime?: number;
  lastChecked: string;
  description: string;
}

// Analytics and Traffic Data
export interface AnalyticsSummary {
  visitorsThisWeek: number;
  visitorsThisMonth: number;
  pageViewsThisWeek: number;
  pageViewsThisMonth: number;
  newVsReturning: VisitorBreakdown;
  deviceBreakdown: DeviceBreakdown;
  topPages: PageStat[];
  trafficSources: TrafficSourceStat[];
  topCities: CityStat[];
  avgTimeOnSite: number;
  avgPagesPerVisit: number;
  whatsappClicksThisWeek: number;
  formSubmissionsThisWeek: number;
  dailyStats7Days: DailyAnalyticsStat[];
}

export interface VisitorBreakdown {
  newVisitors: number;
  returningVisitors: number;
  newPercentage: number;
  returningPercentage: number;
}

export interface DeviceBreakdown {
  mobile: number;
  desktop: number;
  tablet: number;
  mobilePercentage: number;
  desktopPercentage: number;
  tabletPercentage: number;
}

export interface PageStat {
  url: string;
  title: string;
  views: number;
}

export interface TrafficSourceStat {
  source: string;
  visits: number;
  percentage: number;
}

export interface CityStat {
  city: string;
  country: string;
  visitors: number;
}

export interface DailyAnalyticsStat {
  date: string;
  uniqueVisitors: number;
  totalPageViews: number;
  newVisitors: number;
  returningVisitors: number;
}

// Subscription Analytics
export interface SubscriptionAnalytics {
  planDistribution: PlanDistribution[];
  subscriptionTrends: SubscriptionTrend[];
  churnRate: number;
  averageRevenuePerUser: number;
  lifetimeValue: number;
}

export interface PlanDistribution {
  planName: string;
  count: number;
  percentage: number;
  revenue: number;
  color: string;
}

export interface SubscriptionTrend {
  date: string;
  newSubscriptions: number;
  cancelledSubscriptions: number;
  revenue: number;
}

// Recent Activity
export interface RecentActivity {
  type: ActivityType;
  title: string;
  description: string;
  user?: ActivityUser;
  organization?: ActivityOrganization;
  status: ActivityStatus;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ActivityUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ActivityOrganization {
  id: string;
  name: string;
  logo?: string;
}

export type ActivityType = 
  | 'user_registration' 
  | 'organization_created' 
  | 'application_created' 
  | 'application_deployed' 
  | 'subscription_created' 
  | 'subscription_cancelled'
  | 'domain_purchased'
  | 'support_request';

export type ActivityStatus = 
  | 'completed' 
  | 'in_progress' 
  | 'failed' 
  | 'pending';

// Filter and Date Range Types
export interface DashboardFilters {
  dateRange: DateRangeOption;
  organizationId?: string;
  tenantId?: string;
  applicationId?: string;
}

export type DateRangeOption = 
  | 'last_7_days' 
  | 'last_30_days' 
  | 'last_90_days' 
  | 'last_12_months'
  | 'custom';

export interface CustomDateRange {
  startDate: string;
  endDate: string;
}

// Dashboard State
export interface DashboardState {
  platformStatistics: PlatformStatistics | null;
  analyticsSummary: AnalyticsSummary | null;
  subscriptionAnalytics: SubscriptionAnalytics | null;
  recentActivity: RecentActivity[];
  filters: DashboardFilters;
  customDateRange: CustomDateRange | null;
  loading: {
    statistics: boolean;
    analytics: boolean;
    subscriptions: boolean;
    activity: boolean;
  };
  error: {
    statistics: string | null;
    analytics: string | null;
    subscriptions: string | null;
    activity: string | null;
  };
  lastUpdated: {
    statistics: string | null;
    analytics: string | null;
    subscriptions: string | null;
    activity: string | null;
  };
}

// API Response Types
export interface DashboardStatisticsResponse {
  platformStatistics: PlatformStatistics;
}

export interface DashboardAnalyticsResponse {
  analyticsSummary: AnalyticsSummary;
}

export interface DashboardSubscriptionResponse {
  subscriptionAnalytics: SubscriptionAnalytics;
}

export interface DashboardActivityResponse {
  recentActivity: RecentActivity[];
}

// Chart Configuration Types
export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip: {
      enabled: boolean;
      backgroundColor?: string;
    };
  };
  scales?: {
    x?: {
      display: boolean;
      grid?: {
        display: boolean;
      };
    };
    y?: {
      display: boolean;
      grid?: {
        display: boolean;
      };
    };
  };
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
}

// Enhanced Analytics Types

export interface CountryMetric {
  countryCode: string;
  countryName: string;
  count: number;
  percentage: number;
  revenue?: number;
}

export interface IndustryMetric {
  industry: string;
  count: number;
  percentage: number;
  averageRevenue?: number;
}

export interface PlanDistributionMetric {
  planId: string;
  planName: string;
  count: number;
  percentage: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  color: string;
}

// Contact and Lead Analytics
export interface ContactAnalytics {
  totalContacts: number;
  contactGrowth: GrowthMetric;
  leadsByActivityType: ActivityTypeMetric[];
  leadsByCountry: CountryMetric[];
  leadsByContext: ContextMetric[];
  conversionRate: number;
  averageLeadsPerDay: number;
}

export interface ActivityTypeMetric {
  activityType: string;
  count: number;
  percentage: number;
  conversionRate: number;
}

export interface ContextMetric {
  context: string;
  count: number;
  percentage: number;
}

// Revenue and Commerce Analytics
export interface RevenueAnalytics {
  totalRevenue: number;
  revenueGrowth: GrowthMetric;
  averageTransactionAmount: number;
  paymentMethodDistribution: PaymentMethodMetric[];
  monthlyRevenueBreakdown: MonthlyRevenueMetric[];
  revenueByPlan: PlanRevenueMetric[];
  couponUsage: CouponUsageMetric;
}

export interface PaymentMethodMetric {
  method: string;
  count: number;
  totalAmount: number;
  percentage: number;
  successRate: number;
}

export interface MonthlyRevenueMetric {
  month: string;
  year: number;
  revenue: number;
  transactionCount: number;
  averageAmount: number;
}

export interface PlanRevenueMetric {
  planName: string;
  subscriptionCount: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalRevenue: number;
}

export interface CouponUsageMetric {
  totalCoupons: number;
  activeCoupons: number;
  totalUses: number;
  totalDiscountGiven: number;
  averageDiscountPercentage: number;
}

// Deployment Analytics
export interface DeploymentAnalytics {
  totalDeployments: number;
  deploymentGrowth: GrowthMetric;
  successRate: number;
  averageDeploymentTime: number;
  deploymentsByStatus: DeploymentStatusMetric[];
  monthlyDeploymentTrends: MonthlyDeploymentMetric[];
  topApplicationsByDeployments: TopApplicationMetric[];
}

export interface DeploymentStatusMetric {
  status: string;
  count: number;
  percentage: number;
}

export interface MonthlyDeploymentMetric {
  month: string;
  year: number;
  totalDeployments: number;
  successfulDeployments: number;
  failedDeployments: number;
  averageTime: number;
}

export interface TopApplicationMetric {
  applicationId: string;
  applicationName: string;
  organizationName: string;
  deploymentCount: number;
  successRate: number;
  lastDeployed: string;
}

// Enhanced User Engagement
export interface UserEngagementAnalytics {
  totalActiveUsers: number;
  userGrowth: GrowthMetric;
  userRetention: RetentionMetric;
  usersByAccountType: UserAccountTypeMetric[];
  deviceDistribution: DeviceDistributionMetric[];
  engagementScore: number;
}

export interface RetentionMetric {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionTime: number;
}

export interface UserAccountTypeMetric {
  accountType: string;
  count: number;
  percentage: number;
  averageApplications: number;
}

export interface DeviceDistributionMetric {
  deviceType: string;
  count: number;
  percentage: number;
}

// Application Content Analytics
export interface ContentAnalytics {
  totalApplications: number;
  contentRichness: ContentRichnessMetric;
  topContentTypes: ContentTypeMetric[];
  engagementByContentType: ContentEngagementMetric[];
}

export interface ContentRichnessMetric {
  averageBlogPosts: number;
  averageServices: number;
  averageProducts: number;
  averageTeamMembers: number;
  averageTestimonials: number;
  contentScore: number;
}

export interface ContentTypeMetric {
  contentType: string;
  totalCount: number;
  averagePerApplication: number;
  topApplications: string[];
}

export interface ContentEngagementMetric {
  contentType: string;
  contactSubmissions: number;
  newsletterSubscriptions: number;
  engagementRate: number;
}

// Learning Center Analytics (if enabled)
export interface LearningAnalytics {
  totalCourses: number;
  totalLessons: number;
  totalDuration: number;
  coursesByDifficulty: CourseDifficultyMetric[];
  averageCourseLength: number;
  learningEngagement: number;
}

export interface CourseDifficultyMetric {
  difficulty: string;
  count: number;
  percentage: number;
  averageDuration: number;
}

// Enhanced Dashboard State with new analytics
export interface EnhancedDashboardState extends DashboardState {
  // Additional analytics
  contactAnalytics: ContactAnalytics | null;
  revenueAnalytics: RevenueAnalytics | null;
  deploymentAnalytics: DeploymentAnalytics | null;
  userEngagementAnalytics: UserEngagementAnalytics | null;
  contentAnalytics: ContentAnalytics | null;
  learningAnalytics: LearningAnalytics | null;
  
  // Enhanced loading states
  enhancedLoading: {
    contacts: boolean;
    revenue: boolean;
    deployments: boolean;
    engagement: boolean;
    content: boolean;
    learning: boolean;
  };
  
  // Enhanced error states
  enhancedErrors: {
    contacts: string | null;
    revenue: string | null;
    deployments: string | null;
    engagement: string | null;
    content: string | null;
    learning: string | null;
  };
}