import { gql } from '@apollo/client/core';

/**
 * Dashboard Content Queries — aligned with actual gamma-api GraphQL schema.
 *
 * API conventions:
 *   - @all directives (services, solutions, blogPosts, projects, clients, faqs, stats,
 *     contactRequests, jobPositions) return flat arrays, no paginatorInfo.
 *   - @paginate directives (teams, partners, testimonials, certifications, banners)
 *     accept `first` + `page` and return { data, paginatorInfo }.
 */

// ── Single combined overview query ──────────────────────────────────────────
// Fetches totals for every content domain in one round-trip.
export const GET_DASHBOARD_OVERVIEW = gql`
  query GetDashboardOverview {
    services {
      id
      is_active
    }
    solutions {
      id
      is_active
    }
    blogPosts {
      id
      status
      view_count
    }
    projects {
      id
      status
    }
    teams(first: 1000) {
      data {
        id
        is_active
      }
    }
    partners(first: 1000) {
      data {
        id
        is_active
      }
    }
    clients {
      id
      is_active
    }
    certifications(first: 1000) {
      data {
        id
        is_active
      }
    }
    faqs {
      id
      is_active
      category
    }
    testimonials(first: 1000) {
      data {
        id
        is_active
        rating
      }
    }
    stats {
      id
      is_active
      value
    }
    contactRequests {
      id
      status
      created_at
    }
    jobPositions {
      id
      status
    }
  }
`;

// ── Recent contact requests ─────────────────────────────────────────────────
export const GET_RECENT_CONTACT_REQUESTS = gql`
  query GetRecentContactRequests {
    contactRequests(limit: 5) {
      id
      first_name
      last_name
      email
      subject
      status
      created_at
    }
  }
`;

// ── Recent blog posts ───────────────────────────────────────────────────────
export const GET_RECENT_BLOG_POSTS = gql`
  query GetRecentBlogPosts {
    blogPosts(limit: 5) {
      id
      title
      slug
      status
      view_count
      created_at
    }
  }
`;
