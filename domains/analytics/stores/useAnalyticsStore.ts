import { defineStore } from 'pinia'
import type {
  AnalyticsOverview,
  PageStats,
  ReferrerStats,
  DeviceStats,
  BrowserStats,
  DailyViewStats,
  EventStats,
  UtmStats,
  AnalyticsDateRange,
  CountryStats,
  CityStats,
  TrafficSourceStats,
  DatePreset
} from '../types'
import {
  GET_ANALYTICS_OVERVIEW,
  GET_TOP_PAGES,
  GET_REFERRERS,
  GET_DEVICES,
  GET_BROWSERS,
  GET_DAILY_VIEWS,
  GET_EVENTS,
  GET_UTM,
  GET_ANALYTICS_COUNTRIES,
  GET_ANALYTICS_CITIES,
  GET_ANALYTICS_TRAFFIC_SOURCES
} from '../graphql/queries'
import dayjs from 'dayjs'

const STORAGE_KEY = 'gamma_analytics_daterange'

interface AnalyticsState {
  overview: AnalyticsOverview | null
  previousPeriodOverview: AnalyticsOverview | null
  topPages: PageStats[]
  referrers: ReferrerStats[]
  devices: DeviceStats[]
  browsers: BrowserStats[]
  dailyViews: DailyViewStats[]
  events: EventStats[]
  utm: UtmStats[]
  countries: CountryStats[]
  cities: CityStats[]
  trafficSources: TrafficSourceStats[]
  dateRange: AnalyticsDateRange
  activePreset: DatePreset
  loading: boolean
  error: string | null
}

function loadPersistedDateRange(): { dateRange: AnalyticsDateRange; preset: DatePreset } {
  if (import.meta.server) {
    return {
      dateRange: { date_from: null, date_to: null },
      preset: 'last30'
    }
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        dateRange: parsed.dateRange ?? { date_from: null, date_to: null },
        preset: parsed.preset ?? 'last30'
      }
    }
  } catch {
    // Ignore parse errors
  }
  return {
    dateRange: { date_from: null, date_to: null },
    preset: 'last30'
  }
}

function persistDateRange(dateRange: AnalyticsDateRange, preset: DatePreset): void {
  if (import.meta.server) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dateRange, preset }))
  } catch {
    // Ignore storage errors
  }
}

function computePreviousPeriodRange(dateRange: AnalyticsDateRange): AnalyticsDateRange {
  if (!dateRange.date_from || !dateRange.date_to) return { date_from: null, date_to: null }

  const from = dayjs(dateRange.date_from)
  const to = dayjs(dateRange.date_to)
  const days = to.diff(from, 'day')

  return {
    date_from: from.subtract(days + 1, 'day').format('YYYY-MM-DD'),
    date_to: from.subtract(1, 'day').format('YYYY-MM-DD')
  }
}

export const useAnalyticsStore = defineStore('analytics', {
  state: (): AnalyticsState => {
    const persisted = loadPersistedDateRange()
    return {
      overview: null,
      previousPeriodOverview: null,
      topPages: [],
      referrers: [],
      devices: [],
      browsers: [],
      dailyViews: [],
      events: [],
      utm: [],
      countries: [],
      cities: [],
      trafficSources: [],
      dateRange: persisted.dateRange,
      activePreset: persisted.preset,
      loading: false,
      error: null
    }
  },

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    hasData: (state) => state.overview !== null,

    formattedAvgDuration: (state): string => {
      if (!state.overview?.avg_duration_ms) return '--'
      const seconds = Math.round(state.overview.avg_duration_ms / 1000)
      if (seconds < 60) return `${seconds}s`
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}m ${remainingSeconds}s`
    },

    dateVariables: (state) => ({
      date_from: state.dateRange.date_from,
      date_to: state.dateRange.date_to
    }),

    previousDateVariables: (state) => {
      const prev = computePreviousPeriodRange(state.dateRange)
      return {
        date_from: prev.date_from,
        date_to: prev.date_to
      }
    },

    /** Calculate trend percentages comparing current vs previous period */
    trends(): Record<string, number> {
      const current = this.overview
      const previous = this.previousPeriodOverview
      if (!current || !previous) return {}

      const calcTrend = (curr: number, prev: number): number => {
        if (prev === 0) return curr > 0 ? 100 : 0
        return Math.round(((curr - prev) / prev) * 100)
      }

      return {
        visitors: calcTrend(current.unique_visitors, previous.unique_visitors),
        pageViews: calcTrend(current.total_views, previous.total_views),
        avgDuration: calcTrend(current.avg_duration_ms ?? 0, previous.avg_duration_ms ?? 0)
      }
    },

    /** Top country from countries list */
    topCountry: (state): CountryStats | null => {
      if (!state.countries.length) return null
      return state.countries[0]
    },

    /** Contact form submissions from events */
    contactRequestsCount: (state): number => {
      const contactEvent = state.events.find(
        e => e.event_name === 'contact_form_submit' ||
             e.event_name === 'form_submission' ||
             e.event_name === 'contact_submit'
      )
      return contactEvent?.count ?? 0
    },

    /** Total traffic sources for doughnut center */
    totalTrafficViews: (state): number => {
      return state.trafficSources.reduce((sum, s) => sum + s.views, 0)
    }
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    setDateRange(dateRange: Partial<AnalyticsDateRange>) {
      this.dateRange = { ...this.dateRange, ...dateRange }
    },

    setActivePreset(preset: DatePreset) {
      this.activePreset = preset
      persistDateRange(this.dateRange, preset)
    },

    applyPreset(preset: DatePreset) {
      const today = dayjs().format('YYYY-MM-DD')

      const daysMap: Record<Exclude<DatePreset, 'custom'>, number> = {
        last7: 7,
        last30: 30,
        last90: 90
      }

      if (preset !== 'custom') {
        this.setDateRange({
          date_from: dayjs().subtract(daysMap[preset], 'day').format('YYYY-MM-DD'),
          date_to: today
        })
      }

      this.setActivePreset(preset)
    },

    async fetchOverview() {
      try {
        const { data, error } = await useAsyncQuery<{ analyticsOverview: AnalyticsOverview }>(
          GET_ANALYTICS_OVERVIEW,
          this.dateVariables
        )
        if (error.value) throw new Error(error.value.message || 'Failed to fetch overview')
        if (data.value) this.overview = data.value.analyticsOverview
      } catch (err: unknown) {
        console.error('Analytics overview error:', err)
      }
    },

    async fetchPreviousPeriodOverview() {
      try {
        const { data, error } = await useAsyncQuery<{ analyticsOverview: AnalyticsOverview }>(
          GET_ANALYTICS_OVERVIEW,
          this.previousDateVariables
        )
        if (error.value) throw new Error(error.value.message || 'Failed to fetch previous overview')
        if (data.value) this.previousPeriodOverview = data.value.analyticsOverview
      } catch (err: unknown) {
        console.error('Analytics previous period error:', err)
      }
    },

    async fetchTopPages() {
      try {
        const { data, error } = await useAsyncQuery<{ analyticsTopPages: PageStats[] }>(
          GET_TOP_PAGES,
          { ...this.dateVariables, limit: 7 }
        )
        if (error.value) throw new Error(error.value.message || 'Failed to fetch top pages')
        if (data.value) this.topPages = data.value.analyticsTopPages
      } catch (err: unknown) {
        console.error('Analytics top pages error:', err)
      }
    },

    async fetchReferrers() {
      try {
        const { data, error } = await useAsyncQuery<{ analyticsReferrers: ReferrerStats[] }>(
          GET_REFERRERS,
          { ...this.dateVariables, limit: 10 }
        )
        if (error.value) throw new Error(error.value.message || 'Failed to fetch referrers')
        if (data.value) this.referrers = data.value.analyticsReferrers
      } catch (err: unknown) {
        console.error('Analytics referrers error:', err)
      }
    },

    async fetchDevices() {
      try {
        const { data, error } = await useAsyncQuery<{ analyticsDevices: DeviceStats[] }>(
          GET_DEVICES,
          this.dateVariables
        )
        if (error.value) throw new Error(error.value.message || 'Failed to fetch devices')
        if (data.value) this.devices = data.value.analyticsDevices
      } catch (err: unknown) {
        console.error('Analytics devices error:', err)
      }
    },

    async fetchBrowsers() {
      try {
        const { data, error } = await useAsyncQuery<{ analyticsBrowsers: BrowserStats[] }>(
          GET_BROWSERS,
          this.dateVariables
        )
        if (error.value) throw new Error(error.value.message || 'Failed to fetch browsers')
        if (data.value) this.browsers = data.value.analyticsBrowsers
      } catch (err: unknown) {
        console.error('Analytics browsers error:', err)
      }
    },

    async fetchDailyViews() {
      try {
        const { data, error } = await useAsyncQuery<{ analyticsDailyViews: DailyViewStats[] }>(
          GET_DAILY_VIEWS,
          this.dateVariables
        )
        if (error.value) throw new Error(error.value.message || 'Failed to fetch daily views')
        if (data.value) this.dailyViews = data.value.analyticsDailyViews
      } catch (err: unknown) {
        console.error('Analytics daily views error:', err)
      }
    },

    async fetchEvents() {
      try {
        const { data, error } = await useAsyncQuery<{ analyticsEvents: EventStats[] }>(
          GET_EVENTS,
          this.dateVariables
        )
        if (error.value) throw new Error(error.value.message || 'Failed to fetch events')
        if (data.value) this.events = data.value.analyticsEvents
      } catch (err: unknown) {
        console.error('Analytics events error:', err)
      }
    },

    async fetchUtm() {
      try {
        const { data, error } = await useAsyncQuery<{ analyticsUtm: UtmStats[] }>(
          GET_UTM,
          this.dateVariables
        )
        if (error.value) throw new Error(error.value.message || 'Failed to fetch UTM data')
        if (data.value) this.utm = data.value.analyticsUtm
      } catch (err: unknown) {
        console.error('Analytics UTM error:', err)
      }
    },

    async fetchCountries() {
      try {
        const { data, error } = await useAsyncQuery<{ analyticsCountries: CountryStats[] }>(
          GET_ANALYTICS_COUNTRIES,
          { ...this.dateVariables, limit: 10 }
        )
        if (error.value) throw new Error(error.value.message || 'Failed to fetch countries')
        if (data.value) this.countries = data.value.analyticsCountries
      } catch (err: unknown) {
        console.error('Analytics countries error:', err)
      }
    },

    async fetchCities() {
      try {
        const { data, error } = await useAsyncQuery<{ analyticsCities: CityStats[] }>(
          GET_ANALYTICS_CITIES,
          { ...this.dateVariables, limit: 10 }
        )
        if (error.value) throw new Error(error.value.message || 'Failed to fetch cities')
        if (data.value) this.cities = data.value.analyticsCities
      } catch (err: unknown) {
        console.error('Analytics cities error:', err)
      }
    },

    async fetchTrafficSources() {
      try {
        const { data, error } = await useAsyncQuery<{ analyticsTrafficSources: TrafficSourceStats[] }>(
          GET_ANALYTICS_TRAFFIC_SOURCES,
          this.dateVariables
        )
        if (error.value) throw new Error(error.value.message || 'Failed to fetch traffic sources')
        if (data.value) this.trafficSources = data.value.analyticsTrafficSources
      } catch (err: unknown) {
        console.error('Analytics traffic sources error:', err)
      }
    },

    async fetchAll() {
      this.setLoading(true)
      this.setError(null)

      try {
        await Promise.all([
          this.fetchOverview(),
          this.fetchPreviousPeriodOverview(),
          this.fetchTopPages(),
          this.fetchReferrers(),
          this.fetchDevices(),
          this.fetchBrowsers(),
          this.fetchDailyViews(),
          this.fetchEvents(),
          this.fetchUtm(),
          this.fetchCountries(),
          this.fetchTrafficSources()
        ])
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load analytics data'
        this.setError(message)
      } finally {
        this.setLoading(false)
      }
    }
  }
})
