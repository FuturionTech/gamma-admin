export interface AnalyticsOverview {
  total_views: number
  unique_visitors: number
  views_today: number
  views_this_week: number
  views_this_month: number
  avg_duration_ms: number | null
  pages_per_session: number | null
  avg_page_load_ms: number | null
  bot_views: number | null
}

export interface PageStats {
  path: string
  views: number
  unique_visitors: number
}

export interface ReferrerStats {
  referrer: string
  views: number
}

export interface DeviceStats {
  device_type: string
  count: number
  percentage: number
}

export interface BrowserStats {
  browser: string
  count: number
}

export interface DailyViewStats {
  date: string
  views: number
  unique_visitors: number
}

export interface EventStats {
  event_name: string
  count: number
}

export interface UtmStats {
  source: string
  medium: string | null
  campaign: string | null
  views: number
}

export interface AnalyticsDateRange {
  date_from: string | null
  date_to: string | null
}

export interface CountryStats {
  country: string
  country_name: string
  views: number
  unique_visitors: number
  percentage: number
}

export interface CityStats {
  city: string
  country: string
  views: number
}

export interface TrafficSourceStats {
  referrer: string
  views: number
}

export interface OsStats {
  os: string
  count: number
  percentage: number
}

export type DatePreset = 'last7' | 'last30' | 'last90' | 'custom'
