import { ref, computed } from 'vue';
import { useLazyAsyncQuery } from '#imports';
import type {
  DashboardOverview,
  ContentDomainMetrics,
  ServicesMetrics,
  SolutionsMetrics,
  BlogMetrics,
  ProjectsMetrics,
  TeamMetrics,
  PartnersMetrics,
  ClientsMetrics,
  CertificationsMetrics,
  FAQsMetrics,
  CareersMetrics,
  TestimonialsMetrics,
  StatsMetrics,
  RecentContentActivity,
  ContentDistribution,
} from '../types/content';

import {
  GET_SERVICES_METRICS,
  GET_SOLUTIONS_METRICS,
  GET_BLOG_METRICS,
  GET_PROJECTS_METRICS,
  GET_TEAM_METRICS,
  GET_PARTNERS_METRICS,
  GET_CLIENTS_METRICS,
  GET_CERTIFICATIONS_METRICS,
  GET_FAQS_METRICS,
  GET_CAREERS_METRICS,
  GET_TESTIMONIALS_METRICS,
  GET_STATS_METRICS,
  GET_RECENT_CONTENT_ACTIVITY,
} from '../graphql/content-queries';

export const useDashboardData = () => {
  const loading = ref(true);
  const error = ref<string | null>(null);
  const dashboardData = ref<Partial<DashboardOverview>>({});
  const recentActivity = ref<RecentContentActivity[]>([]);

  // Helper function to calculate metrics from raw data
  const calculateMetrics = (data: any[], statusField: string = 'status'): ContentDomainMetrics => {
    const total = data.length;
    const active = data.filter(item => item[statusField] === 'active' || item[statusField] === 'published').length;
    const inactive = total - active;

    // Recent count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCount = data.filter(item => new Date(item.created_at) > thirtyDaysAgo).length;

    const growthPercentage = total > 0 ? (recentCount / total) * 100 : 0;

    return {
      total,
      active,
      inactive,
      recentCount,
      growthPercentage,
    };
  };

  // Fetch Services Metrics
  const fetchServicesMetrics = async (): Promise<ServicesMetrics> => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_SERVICES_METRICS);

      if (queryError.value) {
        console.warn('Services metrics error:', queryError.value);
        return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0 };
      }

      const services = data.value?.services?.data || [];
      return calculateMetrics(services);
    } catch (err) {
      console.error('Failed to fetch services metrics:', err);
      return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0 };
    }
  };

  // Fetch Solutions Metrics
  const fetchSolutionsMetrics = async (): Promise<SolutionsMetrics> => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_SOLUTIONS_METRICS);

      if (queryError.value) {
        console.warn('Solutions metrics error:', queryError.value);
        return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, totalFeatures: 0, totalBenefits: 0 };
      }

      const solutions = data.value?.solutions?.data || [];
      const baseMetrics = calculateMetrics(solutions);

      const totalFeatures = solutions.reduce((sum, sol) => sum + (sol.features?.length || 0), 0);
      const totalBenefits = solutions.reduce((sum, sol) => sum + (sol.benefits?.length || 0), 0);

      return {
        ...baseMetrics,
        totalFeatures,
        totalBenefits,
      };
    } catch (err) {
      console.error('Failed to fetch solutions metrics:', err);
      return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, totalFeatures: 0, totalBenefits: 0 };
    }
  };

  // Fetch Blog Metrics
  const fetchBlogMetrics = async (): Promise<BlogMetrics> => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_BLOG_METRICS);

      if (queryError.value) {
        console.warn('Blog metrics error:', queryError.value);
        return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, published: 0, draft: 0, totalViews: 0, averageViews: 0 };
      }

      const posts = data.value?.blogPosts?.data || [];
      const baseMetrics = calculateMetrics(posts);

      const published = posts.filter(p => p.status === 'published').length;
      const draft = posts.filter(p => p.status === 'draft').length;
      const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
      const averageViews = posts.length > 0 ? totalViews / posts.length : 0;

      return {
        ...baseMetrics,
        published,
        draft,
        totalViews,
        averageViews,
      };
    } catch (err) {
      console.error('Failed to fetch blog metrics:', err);
      return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, published: 0, draft: 0, totalViews: 0, averageViews: 0 };
    }
  };

  // Fetch Projects Metrics
  const fetchProjectsMetrics = async (): Promise<ProjectsMetrics> => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_PROJECTS_METRICS);

      if (queryError.value) {
        console.warn('Projects metrics error:', queryError.value);
        return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, published: 0, draft: 0 };
      }

      const projects = data.value?.projects?.data || [];
      const baseMetrics = calculateMetrics(projects);

      const published = projects.filter(p => p.status === 'published').length;
      const draft = projects.filter(p => p.status === 'draft').length;

      return {
        ...baseMetrics,
        published,
        draft,
      };
    } catch (err) {
      console.error('Failed to fetch projects metrics:', err);
      return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, published: 0, draft: 0 };
    }
  };

  // Fetch Team Metrics
  const fetchTeamMetrics = async (): Promise<TeamMetrics> => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_TEAM_METRICS);

      if (queryError.value) {
        console.warn('Team metrics error:', queryError.value);
        return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0 };
      }

      const members = data.value?.teamMembers?.data || [];
      return calculateMetrics(members);
    } catch (err) {
      console.error('Failed to fetch team metrics:', err);
      return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0 };
    }
  };

  // Fetch Partners Metrics
  const fetchPartnersMetrics = async (): Promise<PartnersMetrics> => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_PARTNERS_METRICS);

      if (queryError.value) {
        console.warn('Partners metrics error:', queryError.value);
        return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0 };
      }

      const partners = data.value?.partners?.data || [];
      return calculateMetrics(partners);
    } catch (err) {
      console.error('Failed to fetch partners metrics:', err);
      return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0 };
    }
  };

  // Fetch Clients Metrics
  const fetchClientsMetrics = async (): Promise<ClientsMetrics> => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_CLIENTS_METRICS);

      if (queryError.value) {
        console.warn('Clients metrics error:', queryError.value);
        return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, byIndustry: [] };
      }

      const clients = data.value?.clients?.data || [];
      const baseMetrics = calculateMetrics(clients);

      // Calculate industry breakdown
      const industryMap = new Map<string, number>();
      clients.forEach(client => {
        const industry = client.industry || 'Other';
        industryMap.set(industry, (industryMap.get(industry) || 0) + 1);
      });

      const byIndustry = Array.from(industryMap.entries()).map(([industry, count]) => ({
        industry,
        count,
        percentage: (count / clients.length) * 100,
      }));

      return {
        ...baseMetrics,
        byIndustry,
      };
    } catch (err) {
      console.error('Failed to fetch clients metrics:', err);
      return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, byIndustry: [] };
    }
  };

  // Fetch Certifications Metrics
  const fetchCertificationsMetrics = async (): Promise<CertificationsMetrics> => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_CERTIFICATIONS_METRICS);

      if (queryError.value) {
        console.warn('Certifications metrics error:', queryError.value);
        return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0 };
      }

      const certifications = data.value?.certifications?.data || [];
      return calculateMetrics(certifications);
    } catch (err) {
      console.error('Failed to fetch certifications metrics:', err);
      return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0 };
    }
  };

  // Fetch FAQs Metrics
  const fetchFAQsMetrics = async (): Promise<FAQsMetrics> => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_FAQS_METRICS);

      if (queryError.value) {
        console.warn('FAQs metrics error:', queryError.value);
        return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, byCategory: [] };
      }

      const faqs = data.value?.faqs?.data || [];
      const baseMetrics = calculateMetrics(faqs);

      // Calculate category breakdown
      const categoryMap = new Map<string, number>();
      faqs.forEach(faq => {
        const category = faq.category || 'General';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      const byCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
        percentage: (count / faqs.length) * 100,
      }));

      return {
        ...baseMetrics,
        byCategory,
      };
    } catch (err) {
      console.error('Failed to fetch FAQs metrics:', err);
      return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, byCategory: [] };
    }
  };

  // Fetch Careers Metrics
  const fetchCareersMetrics = async (): Promise<CareersMetrics> => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_CAREERS_METRICS);

      if (queryError.value) {
        console.warn('Careers metrics error:', queryError.value);
        return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, openPositions: 0 };
      }

      const careers = data.value?.careers?.data || [];
      const baseMetrics = calculateMetrics(careers);

      const openPositions = careers.filter(c => c.status === 'active').length;

      return {
        ...baseMetrics,
        openPositions,
      };
    } catch (err) {
      console.error('Failed to fetch careers metrics:', err);
      return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, openPositions: 0 };
    }
  };

  // Fetch Testimonials Metrics
  const fetchTestimonialsMetrics = async (): Promise<TestimonialsMetrics> => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_TESTIMONIALS_METRICS);

      if (queryError.value) {
        console.warn('Testimonials metrics error:', queryError.value);
        return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, averageRating: 0, ratingDistribution: [] };
      }

      const testimonials = data.value?.testimonials?.data || [];
      const baseMetrics = calculateMetrics(testimonials);

      const totalRating = testimonials.reduce((sum, t) => sum + (t.rating || 0), 0);
      const averageRating = testimonials.length > 0 ? totalRating / testimonials.length : 0;

      // Rating distribution
      const ratingMap = new Map<number, number>();
      testimonials.forEach(t => {
        const rating = t.rating || 0;
        ratingMap.set(rating, (ratingMap.get(rating) || 0) + 1);
      });

      const ratingDistribution = Array.from(ratingMap.entries()).map(([rating, count]) => ({
        rating,
        count,
        percentage: (count / testimonials.length) * 100,
      }));

      return {
        ...baseMetrics,
        averageRating,
        ratingDistribution,
      };
    } catch (err) {
      console.error('Failed to fetch testimonials metrics:', err);
      return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, averageRating: 0, ratingDistribution: [] };
    }
  };

  // Fetch Stats Metrics
  const fetchStatsMetrics = async (): Promise<StatsMetrics> => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_STATS_METRICS);

      if (queryError.value) {
        console.warn('Stats metrics error:', queryError.value);
        return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, totalValue: 0 };
      }

      const stats = data.value?.stats?.data || [];
      const baseMetrics = calculateMetrics(stats);

      const totalValue = stats.reduce((sum, s) => sum + (parseInt(s.value) || 0), 0);

      return {
        ...baseMetrics,
        totalValue,
      };
    } catch (err) {
      console.error('Failed to fetch stats metrics:', err);
      return { total: 0, active: 0, inactive: 0, recentCount: 0, growthPercentage: 0, totalValue: 0 };
    }
  };

  // Fetch Recent Activity
  const fetchRecentActivity = async () => {
    try {
      const { data, error: queryError } = await useLazyAsyncQuery(GET_RECENT_CONTENT_ACTIVITY);

      if (queryError.value) {
        console.warn('Recent activity error:', queryError.value);
        return;
      }

      const activities: RecentContentActivity[] = [];

      // Blog posts
      (data.value?.blogPosts?.data || []).forEach((post: any) => {
        activities.push({
          type: 'blog',
          id: post.id,
          title: post.title_fr || post.title_en,
          status: post.status,
          created_at: post.created_at,
          icon: 'ki-duotone ki-book',
          iconColor: 'bg-light-primary text-primary',
          route: `/blog/${post.id}`,
        });
      });

      // Projects
      (data.value?.projects?.data || []).forEach((project: any) => {
        activities.push({
          type: 'project',
          id: project.id,
          title: project.title_fr || project.title_en,
          status: project.status,
          created_at: project.created_at,
          icon: 'ki-duotone ki-briefcase',
          iconColor: 'bg-light-success text-success',
          route: `/projects/${project.id}`,
        });
      });

      // Services
      (data.value?.services?.data || []).forEach((service: any) => {
        activities.push({
          type: 'service',
          id: service.id,
          title: service.title_fr || service.title_en,
          status: service.status,
          created_at: service.created_at,
          icon: 'ki-duotone ki-setting-2',
          iconColor: 'bg-light-info text-info',
          route: `/services/${service.id}`,
        });
      });

      // Team members
      (data.value?.teamMembers?.data || []).forEach((member: any) => {
        activities.push({
          type: 'team',
          id: member.id,
          title: `${member.first_name} ${member.last_name}`,
          status: member.status,
          created_at: member.created_at,
          icon: 'ki-duotone ki-user',
          iconColor: 'bg-light-warning text-warning',
          route: `/team/${member.id}`,
        });
      });

      // Sort by creation date (most recent first)
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      recentActivity.value = activities.slice(0, 10);
    } catch (err) {
      console.error('Failed to fetch recent activity:', err);
    }
  };

  // Main fetch function
  const fetchDashboardData = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Fetch all metrics in parallel
      const [
        services,
        solutions,
        blog,
        projects,
        team,
        partners,
        clients,
        certifications,
        faqs,
        careers,
        testimonials,
        stats,
      ] = await Promise.all([
        fetchServicesMetrics(),
        fetchSolutionsMetrics(),
        fetchBlogMetrics(),
        fetchProjectsMetrics(),
        fetchTeamMetrics(),
        fetchPartnersMetrics(),
        fetchClientsMetrics(),
        fetchCertificationsMetrics(),
        fetchFAQsMetrics(),
        fetchCareersMetrics(),
        fetchTestimonialsMetrics(),
        fetchStatsMetrics(),
      ]);

      dashboardData.value = {
        services,
        solutions,
        blog,
        projects,
        team,
        partners,
        clients,
        certifications,
        faqs,
        careers,
        testimonials,
        stats,
      };

      // Fetch recent activity
      await fetchRecentActivity();

    } catch (err: any) {
      error.value = err.message || 'Failed to load dashboard data';
      console.error('Dashboard data fetch error:', err);
    } finally {
      loading.value = false;
    }
  };

  // Computed values for content distribution
  const contentDistribution = computed<ContentDistribution[]>(() => {
    const data = dashboardData.value;
    if (!data) return [];

    return [
      { label: 'Services', value: data.services?.total || 0, percentage: 0, color: '#009ef7' },
      { label: 'Solutions', value: data.solutions?.total || 0, percentage: 0, color: '#7239ea' },
      { label: 'Blog', value: data.blog?.total || 0, percentage: 0, color: '#f1416c' },
      { label: 'Projects', value: data.projects?.total || 0, percentage: 0, color: '#50cd89' },
      { label: 'FAQs', value: data.faqs?.total || 0, percentage: 0, color: '#a1a5b7' },
    ].map(item => {
      const total = dashboardData.value.services?.total || 0 + dashboardData.value.solutions?.total || 0 +
                    dashboardData.value.blog?.total || 0 + dashboardData.value.projects?.total || 0 +
                    dashboardData.value.faqs?.total || 0;
      return {
        ...item,
        percentage: total > 0 ? (item.value / total) * 100 : 0,
      };
    });
  });

  return {
    loading,
    error,
    dashboardData,
    recentActivity,
    contentDistribution,
    fetchDashboardData,
  };
};
