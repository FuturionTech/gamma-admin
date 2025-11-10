import { gql } from '@apollo/client/core';

/**
 * Dashboard Content Management Queries
 * These queries aggregate metrics from all content domains for the dashboard overview
 */

// Services Metrics
export const GET_SERVICES_METRICS = gql`
  query GetServicesMetrics {
    services(first: 10000) {
      paginatorInfo {
        total
      }
      data {
        id
        status
        created_at
      }
    }
  }
`;

// Solutions Metrics
export const GET_SOLUTIONS_METRICS = gql`
  query GetSolutionsMetrics {
    solutions(first: 10000) {
      paginatorInfo {
        total
      }
      data {
        id
        status
        created_at
        features {
          id
        }
        benefits {
          id
        }
      }
    }
  }
`;

// Blog Posts Metrics
export const GET_BLOG_METRICS = gql`
  query GetBlogMetrics {
    blogPosts(first: 10000) {
      paginatorInfo {
        total
      }
      data {
        id
        status
        created_at
        published_at
        views
      }
    }
  }
`;

// Projects/Case Studies Metrics
export const GET_PROJECTS_METRICS = gql`
  query GetProjectsMetrics {
    projects(first: 10000) {
      paginatorInfo {
        total
      }
      data {
        id
        status
        created_at
        published_at
      }
    }
  }
`;

// Team Members Metrics
export const GET_TEAM_METRICS = gql`
  query GetTeamMetrics {
    teamMembers(first: 10000) {
      paginatorInfo {
        total
      }
      data {
        id
        status
        created_at
      }
    }
  }
`;

// Partners Metrics
export const GET_PARTNERS_METRICS = gql`
  query GetPartnersMetrics {
    partners(first: 10000) {
      paginatorInfo {
        total
      }
      data {
        id
        status
        created_at
      }
    }
  }
`;

// Clients Metrics
export const GET_CLIENTS_METRICS = gql`
  query GetClientsMetrics {
    clients(first: 10000) {
      paginatorInfo {
        total
      }
      data {
        id
        status
        industry
        created_at
      }
    }
  }
`;

// Certifications Metrics
export const GET_CERTIFICATIONS_METRICS = gql`
  query GetCertificationsMetrics {
    certifications(first: 10000) {
      paginatorInfo {
        total
      }
      data {
        id
        status
        created_at
      }
    }
  }
`;

// FAQs Metrics
export const GET_FAQS_METRICS = gql`
  query GetFAQsMetrics {
    faqs(first: 10000) {
      paginatorInfo {
        total
      }
      data {
        id
        status
        category
        created_at
      }
    }
  }
`;

// Careers Metrics
export const GET_CAREERS_METRICS = gql`
  query GetCareersMetrics {
    careers(first: 10000) {
      paginatorInfo {
        total
      }
      data {
        id
        status
        created_at
      }
    }
  }
`;

// Testimonials Metrics
export const GET_TESTIMONIALS_METRICS = gql`
  query GetTestimonialsMetrics {
    testimonials(first: 10000) {
      paginatorInfo {
        total
      }
      data {
        id
        status
        rating
        created_at
      }
    }
  }
`;

// Stats/Achievements Metrics
export const GET_STATS_METRICS = gql`
  query GetStatsMetrics {
    stats(first: 10000) {
      paginatorInfo {
        total
      }
      data {
        id
        status
        value
        created_at
      }
    }
  }
`;

// Combined Dashboard Overview Query
export const GET_DASHBOARD_OVERVIEW = gql`
  query GetDashboardOverview {
    services(first: 1, page: 1) {
      paginatorInfo {
        total
      }
    }
    solutions(first: 1, page: 1) {
      paginatorInfo {
        total
      }
    }
    blogPosts(first: 1, page: 1) {
      paginatorInfo {
        total
      }
    }
    projects(first: 1, page: 1) {
      paginatorInfo {
        total
      }
    }
    teamMembers(first: 1, page: 1) {
      paginatorInfo {
        total
      }
    }
    partners(first: 1, page: 1) {
      paginatorInfo {
        total
      }
    }
    clients(first: 1, page: 1) {
      paginatorInfo {
        total
      }
    }
    certifications(first: 1, page: 1) {
      paginatorInfo {
        total
      }
    }
    faqs(first: 1, page: 1) {
      paginatorInfo {
        total
      }
    }
    careers(first: 1, page: 1) {
      paginatorInfo {
        total
      }
    }
    testimonials(first: 1, page: 1) {
      paginatorInfo {
        total
      }
    }
    stats(first: 1, page: 1) {
      paginatorInfo {
        total
      }
    }
  }
`;

// Recent Activity across all domains
export const GET_RECENT_CONTENT_ACTIVITY = gql`
  query GetRecentContentActivity {
    blogPosts(first: 5, orderBy: [{ column: CREATED_AT, order: DESC }]) {
      data {
        id
        title_fr
        title_en
        created_at
        status
      }
    }
    projects(first: 5, orderBy: [{ column: CREATED_AT, order: DESC }]) {
      data {
        id
        title_fr
        title_en
        created_at
        status
      }
    }
    services(first: 5, orderBy: [{ column: CREATED_AT, order: DESC }]) {
      data {
        id
        title_fr
        title_en
        created_at
        status
      }
    }
    teamMembers(first: 5, orderBy: [{ column: CREATED_AT, order: DESC }]) {
      data {
        id
        first_name
        last_name
        created_at
        status
      }
    }
  }
`;
