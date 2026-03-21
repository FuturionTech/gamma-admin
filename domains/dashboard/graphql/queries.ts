/**
 * Dashboard GraphQL queries — re-exports from content-queries.
 *
 * All SaaS-platform queries (organizations, tenants, deployments, analytics,
 * coupons, plans, learning) have been removed because the gamma-api does not
 * expose those types. The dashboard now uses only the content-management
 * queries that match the real schema.
 */
export {
  GET_DASHBOARD_OVERVIEW,
  GET_RECENT_CONTACT_REQUESTS,
  GET_RECENT_BLOG_POSTS,
} from './content-queries';
