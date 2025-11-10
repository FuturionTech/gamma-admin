import { gql } from '@apollo/client/core';

// Real Organization Statistics
export const GET_ORGANIZATION_STATISTICS = gql`
  query GetOrganizationStatistics {
    organizationStatistics
  }
`;

// Real Tenant Statistics  
export const GET_TENANT_STATISTICS = gql`
  query GetTenantStatistics {
    tenantStatistics {
      total_tenants
      active_tenants
      verified_tenants
      tenants_with_devices
      tenants_with_applications
      recent_tenants
      tenants_this_week
      tenants_this_month
      growth_rate_percentage
      tenants_by_organization {
        organization_id
        organization_name
        count
        percentage
      }
      tenants_by_device_type {
        device_type
        count
        percentage
      }
      average_devices_per_tenant
      average_applications_per_tenant
      verification_rate
      activity_rate
      health_score
    }
  }
`;

// Real Payment Transaction Analytics
export const GET_PAYMENT_ANALYTICS = gql`
  query GetPaymentAnalytics(
    $filter: PaymentTransactionFilter
    $limit: Int = 1000
  ) {
    paymentTransactionHistory(
      filter: $filter
      limit: $limit
    ) {
      transactions {
        id
        amount
        currency
        status
        provider_slug
        customer_phone
        created_at
        organization {
          id
          name
        }
      }
      total_count
      total_amount
      has_more
      summary {
        successful_count
        failed_count
        pending_count
        average_amount
      }
    }
  }
`;

// Real Coupon Statistics
export const GET_COUPON_STATISTICS = gql`
  query GetCouponStatistics {
    couponStatistics {
      total_coupons
      active_coupons
      expired_coupons
      depleted_coupons
      total_uses
      total_discount_given
      average_discount_percentage
    }
  }
`;

// Real Analytics Summary for Applications
export const GET_REAL_ANALYTICS_SUMMARY = gql`
  query GetRealAnalyticsSummary($application_id: ID!) {
    analyticsSummary(application_id: $application_id) {
      visitors_this_week
      visitors_this_month
      page_views_this_week
      page_views_this_month
      
      new_vs_returning {
        new_visitors
        returning_visitors
        new_percentage
        returning_percentage
      }
      
      device_breakdown {
        mobile
        desktop
        tablet
        mobile_percentage
        desktop_percentage
        tablet_percentage
      }
      
      top_pages {
        url
        title
        views
      }
      
      traffic_sources {
        source
        visits
        percentage
      }
      
      top_cities {
        city
        country
        visitors
      }
      
      avg_time_on_site
      avg_pages_per_visit
      whatsapp_clicks_this_week
      form_submissions_this_week
      
      daily_stats_7_days {
        date
        unique_visitors
        total_page_views
        new_visitors
        returning_visitors
      }
    }
  }
`;

// Contact Lead Analytics 
export const GET_CONTACT_ANALYTICS = gql`
  query GetContactAnalytics(
    $first: Int = 1000
  ) {
    contacts(first: $first) {
      id
      phone_number
      country_code
      country_name
      activity_type
      agreed_to_contact
      context
      language
      created_at
    }
  }
`;

// Plan Distribution
export const GET_PLAN_ANALYTICS = gql`
  query GetPlanAnalytics {
    plans {
      plans {
        id
        name
        slug
        price_monthly
        price_yearly
        currency
        is_active
        is_featured
        organizations {
          id
        }
      }
    }
  }
`;

// Active Deployments
export const GET_DEPLOYMENT_ANALYTICS = gql`
  query GetDeploymentAnalytics {
    deploymentStatistics
  }
`;

// Learning Center Analytics (if available)
export const GET_LEARNING_ANALYTICS = gql`
  query GetLearningAnalytics {
    learningCategories {
      id
      title
      courses {
        id
        title
        difficulty_level
        estimated_duration_minutes
        lessons {
          id
          title
          duration_seconds
        }
      }
    }
  }
`;

// Application Content Analytics
export const GET_APPLICATION_CONTENT_ANALYTICS = gql`
  query GetApplicationContentAnalytics(
    $filter: ApplicationFilterInput
    $first: Int = 1000
  ) {
    paginatedApplications(filter: $filter, first: $first) {
      data {
        id
        slug
        status
        deploy_url
        created_at
        details {
          name
          description
        }
        # Content richness indicators
        blogPosts {
          id
        }
        services {
          id
        }
        products {
          id
        }
        teams {
          id
        }
        testimonials {
          id
        }
        clients {
          id
        }
        portfolios {
          id
        }
        events {
          id
        }
        contactSubmissions {
          id
          created_at
        }
        newsletterSubscriptions {
          id
          status
          created_at
        }
      }
      paginatorInfo {
        total
      }
    }
  }
`;

// Revenue and Commerce Insights
export const GET_REVENUE_INSIGHTS = gql`
  query GetRevenueInsights(
    $date_from: DateTime
    $date_to: DateTime
  ) {
    paymentTransactionHistory(
      filter: {
        status: [SUCCESSFUL]
        date_from: $date_from
        date_to: $date_to
      }
      limit: 10000
    ) {
      transactions {
        id
        amount
        currency
        status
        created_at
      }
      total_count
      total_amount
      summary {
        successful_count
        failed_count
        pending_count
        average_amount
      }
    }
  }
`;

// Geographic Distribution Analytics
export const GET_GEOGRAPHIC_ANALYTICS = gql`
  query GetGeographicAnalytics {
    contacts(first: 10000) {
      id
      country_code
      country_name
      activity_type
      created_at
    }
  }
`;

// System Performance Metrics
export const GET_SYSTEM_PERFORMANCE = gql`
  query GetSystemPerformance {
    deploymentStatistics
  }
`;

// Top Performing Applications
export const GET_TOP_APPLICATIONS = gql`
  query GetTopApplications($first: Int = 20) {
    paginatedApplications(
      filter: { has_deployment_url: true }
      first: $first
      orderBy: [{ column: CREATED_AT, order: DESC }]
    ) {
      data {
        id
        slug
        status
        deploy_url
        created_at
        details {
          name
          logo_light_url
        }
        # Content metrics
        blogPosts { id }
        services { id }
        products { id }
        teams { id }
        contactSubmissions { id created_at }
        newsletterSubscriptions { id status created_at }
      }
      paginatorInfo {
        total
        hasMorePages
      }
    }
  }
`;

// Business Intelligence - Activity Distribution
export const GET_ACTIVITY_DISTRIBUTION = gql`
  query GetActivityDistribution {
    contacts(first: 10000) {
      id
      activity_type
      country_code
      country_name
      context
      created_at
      agreed_to_contact
    }
  }
`;

// Learning Center Engagement (if available)
export const GET_LEARNING_ENGAGEMENT = gql`
  query GetLearningEngagement {
    learningCategories(is_published: true) {
      id
      title
      courses {
        id
        title
        difficulty_level
        estimated_duration_minutes
        is_published
        lessons {
          id
          title
          duration_seconds
          is_published
          is_free
        }
      }
    }
  }
`;

// Real Organization Statistics Query (Enhanced)
export const GET_ENHANCED_ORGANIZATION_STATS = gql`
  query GetEnhancedOrganizationStats($first: Int = 1000) {
    organizations(first: $first) {
      data {
        id
        name
        organization_type
        industry
        created_at
        plan {
          id
          name
          price_monthly
          price_yearly
        }
        applications {
          id
          status
          created_at
        }
        tenants {
          id
          status
          created_at
          last_login_at
        }
      }
      paginatorInfo {
        total
        count
      }
    }
  }
`;

// Monthly Growth Trends (Real Data)
export const GET_MONTHLY_GROWTH_TRENDS = gql`
  query GetMonthlyGrowthTrends($months: Int = 12) {
    # Organizations by month
    organizations(first: 10000) {
      data {
        id
        created_at
        organization_type
      }
      paginatorInfo {
        total
      }
    }
  }
`;

// Deployment Success Analytics
export const GET_DEPLOYMENT_SUCCESS_ANALYTICS = gql`
  query GetDeploymentSuccessAnalytics($first: Int = 1000) {
    paginatedApplications(first: $first) {
      data {
        id
        status
        created_at
        deploy_url
        deploymentSite {
          id
          site_id
          custom_domain
          deployed_at
        }
      }
      paginatorInfo {
        total
      }
    }
  }
`;

// User Engagement Metrics
export const GET_USER_ENGAGEMENT_METRICS = gql`
  query GetUserEngagementMetrics($first: Int = 1000) {
    tenants(first: $first) {
      data {
        id
        status
        account_type
        created_at
        last_login_at
        email_verified_at
        applications {
          id
        }
        organizations {
          id
        }
        devices {
          id
        }
      }
      paginatorInfo {
        total
      }
    }
  }
`;

// Legacy queries for compatibility
export const GET_ANALYTICS_SUMMARY = gql`
  query GetAnalyticsSummary($application_id: ID!) {
    analyticsSummary(application_id: $application_id) {
      visitors_this_week
      visitors_this_month
      page_views_this_week  
      page_views_this_month
      device_breakdown {
        mobile_percentage
        desktop_percentage
        tablet_percentage
      }
    }
  }
`;

export const GET_SUBSCRIPTION_ANALYTICS = gql`
  query GetSubscriptionAnalytics {
    plans {
      plans {
        id
        name
        organizations {
          id
        }
      }
    }
  }
`;

export const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity($first: Int = 50) {
    tenants(first: $first, orderBy: [{ column: CREATED_AT, order: DESC }]) {
      data {
        id
        first_name
        last_name
        created_at
        organizations {
          id
          name
        }
      }
    }
  }
`;

export const GET_SYSTEM_HEALTH = gql`
  query GetSystemHealth {
    deploymentStatistics
  }
`;