import { gql } from '@apollo/client/core'

export const GET_ANALYTICS_OVERVIEW = gql`
  query GetAnalyticsOverview($date_from: String, $date_to: String) {
    analyticsOverview(date_from: $date_from, date_to: $date_to) {
      total_views
      unique_visitors
      views_today
      views_this_week
      views_this_month
      avg_duration_ms
      pages_per_session
      avg_page_load_ms
      bot_views
    }
  }
`

export const GET_TOP_PAGES = gql`
  query GetTopPages($date_from: String, $date_to: String, $limit: Int) {
    analyticsTopPages(date_from: $date_from, date_to: $date_to, limit: $limit) {
      path
      views
      unique_visitors
    }
  }
`

export const GET_REFERRERS = gql`
  query GetReferrers($date_from: String, $date_to: String, $limit: Int) {
    analyticsReferrers(date_from: $date_from, date_to: $date_to, limit: $limit) {
      referrer
      views
    }
  }
`

export const GET_DEVICES = gql`
  query GetDevices($date_from: String, $date_to: String) {
    analyticsDevices(date_from: $date_from, date_to: $date_to) {
      device_type
      count
      percentage
    }
  }
`

export const GET_BROWSERS = gql`
  query GetBrowsers($date_from: String, $date_to: String) {
    analyticsBrowsers(date_from: $date_from, date_to: $date_to) {
      browser
      count
    }
  }
`

export const GET_DAILY_VIEWS = gql`
  query GetDailyViews($date_from: String, $date_to: String) {
    analyticsDailyViews(date_from: $date_from, date_to: $date_to) {
      date
      views
      unique_visitors
    }
  }
`

export const GET_EVENTS = gql`
  query GetEvents($date_from: String, $date_to: String) {
    analyticsEvents(date_from: $date_from, date_to: $date_to) {
      event_name
      count
    }
  }
`

export const GET_UTM = gql`
  query GetUtm($date_from: String, $date_to: String) {
    analyticsUtm(date_from: $date_from, date_to: $date_to) {
      source
      medium
      campaign
      views
    }
  }
`

export const GET_ANALYTICS_COUNTRIES = gql`
  query GetAnalyticsCountries($date_from: String, $date_to: String, $limit: Int) {
    analyticsCountries(date_from: $date_from, date_to: $date_to, limit: $limit) {
      country
      country_name
      views
      unique_visitors
      percentage
    }
  }
`

export const GET_ANALYTICS_CITIES = gql`
  query GetAnalyticsCities($date_from: String, $date_to: String, $limit: Int) {
    analyticsCities(date_from: $date_from, date_to: $date_to, limit: $limit) {
      city
      country
      views
    }
  }
`

export const GET_ANALYTICS_TRAFFIC_SOURCES = gql`
  query GetAnalyticsTrafficSources($date_from: String, $date_to: String) {
    analyticsTrafficSources(date_from: $date_from, date_to: $date_to) {
      referrer
      views
    }
  }
`
