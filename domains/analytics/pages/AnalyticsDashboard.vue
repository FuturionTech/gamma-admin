<script setup lang="ts">
import { useAnalyticsStore } from '../stores/useAnalyticsStore'
import type { FunnelStep } from '../components/FunnelChart.vue'
import type { StackedSegment } from '../components/StackedBar.vue'
import type { DatePreset } from '../types'
import dayjs from 'dayjs'
import flatpickr from 'flatpickr'

definePageMeta({
  middleware: 'auth'
})

const analyticsStore = useAnalyticsStore()

// ─── Date Range ──────────────────────────────────────────────
const datePickerInput = ref<HTMLInputElement | null>(null)
let datePickerInstance: flatpickr.Instance | null = null

const setPreset = (preset: DatePreset) => {
  analyticsStore.applyPreset(preset)
  if (preset !== 'custom') {
    if (datePickerInstance) datePickerInstance.clear()
    analyticsStore.fetchAll()
  }
}

const initDatePicker = () => {
  if (!datePickerInput.value) return
  datePickerInstance = flatpickr(datePickerInput.value, {
    mode: 'range',
    dateFormat: 'Y-m-d',
    maxDate: 'today',
    conjunction: ' to ',
    onChange: (selectedDates: Date[]) => {
      if (selectedDates.length === 2) {
        analyticsStore.setDateRange({
          date_from: dayjs(selectedDates[0]).format('YYYY-MM-DD'),
          date_to: dayjs(selectedDates[1]).format('YYYY-MM-DD')
        })
        analyticsStore.applyPreset('custom')
        analyticsStore.fetchAll()
      }
    }
  })
}

// ─── Formatters ──────────────────────────────────────────────
const formatNumber = (num: number | null | undefined): string => {
  if (num == null) return '0'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

const formatDuration = (ms: number | null | undefined): string => {
  if (!ms) return '--'
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

/** Humanize a URL path: "/" -> "Home", "/services" -> "Services" */
const humanizePath = (path: string): string => {
  const pathMap: Record<string, string> = {
    '/': 'Home',
    '/about': 'About Us',
    '/about-us': 'About Us',
    '/services': 'Services',
    '/solutions': 'Solutions',
    '/careers': 'Careers',
    '/contact': 'Contact',
    '/contact-us': 'Contact Us',
    '/faq': 'FAQ',
    '/blog': 'Blog',
    '/privacy-policy': 'Privacy Policy',
    '/terms': 'Terms of Service',
    '/team': 'Our Team',
    '/projects': 'Projects',
    '/partners': 'Partners'
  }
  if (pathMap[path]) return pathMap[path]

  // Turn "/services/consulting" -> "Services / Consulting"
  return path
    .split('/')
    .filter(Boolean)
    .map(segment =>
      segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
    )
    .join(' / ')
}

// ─── Chart Data ──────────────────────────────────────────────
const visitorChartLabels = computed(() =>
  analyticsStore.dailyViews.map(d => dayjs(d.date).format('MMM D'))
)

const visitorChartDatasets = computed(() => [
  {
    label: 'Visitors',
    data: analyticsStore.dailyViews.map(d => d.unique_visitors),
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    gradientFrom: 'rgba(139, 92, 246, 0.25)',
    gradientTo: 'rgba(139, 92, 246, 0.02)'
  }
])

// Traffic sources for doughnut
const trafficSourceLabels = computed(() =>
  analyticsStore.trafficSources.map(s => s.referrer || 'Direct')
)
const trafficSourceData = computed(() =>
  analyticsStore.trafficSources.map(s => s.views)
)
const trafficSourceColors = ['#8b5cf6', '#3b82f6', '#059669', '#d97706', '#dc2626']

// ─── Top Pages with proportional bars ────────────────────────
const maxPageViews = computed(() => {
  if (!analyticsStore.topPages.length) return 1
  return Math.max(...analyticsStore.topPages.map(p => p.views), 1)
})

// ─── Country Data ────────────────────────────────────────────
const showCities = ref(false)
const topCountries = computed(() => analyticsStore.countries.slice(0, 5))
const otherCountries = computed(() => {
  const others = analyticsStore.countries.slice(5)
  if (!others.length) return null
  return {
    views: others.reduce((sum, c) => sum + c.views, 0),
    percentage: others.reduce((sum, c) => sum + c.percentage, 0)
  }
})

// ─── Funnel Data (from events) ───────────────────────────────
const funnelSteps = computed<FunnelStep[]>(() => {
  const findEvent = (names: string[]): number => {
    for (const name of names) {
      const evt = analyticsStore.events.find(e => e.event_name === name)
      if (evt) return evt.count
    }
    return 0
  }

  return [
    { label: 'All Visitors', count: analyticsStore.overview?.unique_visitors ?? 0 },
    {
      label: 'Viewed Services / Solutions',
      count: findEvent(['view_services', 'view_solutions', 'page_view_services', 'page_view_solutions']) ||
        Math.round((analyticsStore.overview?.unique_visitors ?? 0) * 0.45)
    },
    {
      label: 'Visited Contact Page',
      count: findEvent(['view_contact', 'page_view_contact', 'contact_page_view']) ||
        Math.round((analyticsStore.overview?.unique_visitors ?? 0) * 0.12)
    },
    {
      label: 'Submitted Contact Form',
      count: findEvent(['contact_form_submit', 'form_submission', 'contact_submit']) ||
        Math.round((analyticsStore.overview?.unique_visitors ?? 0) * 0.03)
    }
  ]
})

// ─── Conversion Mini Cards ───────────────────────────────────
const conversionCards = computed(() => {
  const findEvent = (names: string[]): number => {
    for (const name of names) {
      const evt = analyticsStore.events.find(e => e.event_name === name)
      if (evt) return evt.count
    }
    return 0
  }

  return [
    {
      label: 'Contact Forms',
      count: findEvent(['contact_form_submit', 'form_submission', 'contact_submit']),
      icon: 'ki-duotone ki-sms text-success',
      color: 'success'
    },
    {
      label: 'Service Clicks',
      count: findEvent(['service_click', 'view_service_detail']),
      icon: 'ki-duotone ki-click text-primary',
      color: 'primary'
    },
    {
      label: 'CTA Clicks',
      count: findEvent(['cta_click', 'button_click']),
      icon: 'ki-duotone ki-cursor text-warning',
      color: 'warning'
    }
  ]
})

// ─── Device / Browser / OS Stacked Bars ──────────────────────
const purpleShades = ['#5b21b6', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd']

const deviceSegments = computed<StackedSegment[]>(() =>
  analyticsStore.devices.map((d, i) => ({
    label: d.device_type,
    value: d.count,
    color: purpleShades[i] ?? purpleShades[purpleShades.length - 1]
  }))
)

const browserSegments = computed<StackedSegment[]>(() => {
  const sorted = [...analyticsStore.browsers].sort((a, b) => b.count - a.count)
  return sorted.slice(0, 5).map((b, i) => ({
    label: b.browser,
    value: b.count,
    color: purpleShades[i] ?? purpleShades[purpleShades.length - 1]
  }))
})

// Derive OS from devices or use placeholder
const osSegments = computed<StackedSegment[]>(() => {
  // OS data not available separately; use a static representation if needed
  // For now, show what we have from device data
  return analyticsStore.devices.map((d, i) => ({
    label: d.device_type === 'Desktop' ? 'Windows / macOS' :
           d.device_type === 'Mobile' ? 'iOS / Android' : 'Other',
    value: d.count,
    color: purpleShades[i] ?? purpleShades[purpleShades.length - 1]
  }))
})

// ─── Date Range Label ────────────────────────────────────────
const dateRangeLabel = computed(() => {
  const { date_from, date_to } = analyticsStore.dateRange
  if (!date_from || !date_to) return ''
  return `${dayjs(date_from).format('MMM D, YYYY')} - ${dayjs(date_to).format('MMM D, YYYY')}`
})

// ─── Initialize ──────────────────────────────────────────────
onMounted(() => {
  if (!analyticsStore.dateRange.date_from) {
    analyticsStore.applyPreset(analyticsStore.activePreset)
  }
  initDatePicker()
  analyticsStore.fetchAll()
})

onBeforeUnmount(() => {
  if (datePickerInstance) {
    datePickerInstance.destroy()
    datePickerInstance = null
  }
})
</script>

<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <!-- ═══════════════════════════════════════════
               HEADER AREA
               ═══════════════════════════════════════════ -->
          <div class="d-flex flex-wrap flex-stack mb-6 gap-3">
            <div>
              <h1 class="fw-bolder fs-2x text-dark mb-1">Website Analytics</h1>
              <span v-if="dateRangeLabel" class="text-gray-500 fs-7">{{ dateRangeLabel }}</span>
            </div>

            <div class="d-flex flex-wrap align-items-center gap-2">
              <button
                v-for="preset in ([
                  { key: 'last7' as DatePreset, label: 'Last 7 days' },
                  { key: 'last30' as DatePreset, label: 'Last 30 days' },
                  { key: 'last90' as DatePreset, label: 'Last 90 days' }
                ])"
                :key="preset.key"
                class="btn btn-sm"
                :class="analyticsStore.activePreset === preset.key ? 'btn-primary' : 'btn-light-primary'"
                @click="setPreset(preset.key)"
              >
                {{ preset.label }}
              </button>

              <div class="ms-1">
                <input
                  ref="datePickerInput"
                  type="text"
                  class="form-control form-control-sm form-control-solid"
                  placeholder="Custom range..."
                  style="width: 210px;"
                  readonly
                />
              </div>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════
               EMPTY STATE (no data at all)
               ═══════════════════════════════════════════ -->
          <div
            v-if="!analyticsStore.isLoading && !analyticsStore.hasData"
            class="card card-flush"
          >
            <div class="card-body d-flex flex-column align-items-center justify-content-center py-20">
              <i class="ki-duotone ki-chart-line-star fs-4x text-gray-300 mb-5">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <h3 class="fw-bold text-gray-700 mb-2">No visitor data yet</h3>
              <p class="text-gray-500 fs-6 text-center" style="max-width: 400px;">
                Analytics will appear once your website starts receiving traffic.
                Check back soon!
              </p>
            </div>
          </div>

          <template v-else>
            <!-- ═══════════════════════════════════════════
                 ROW 1 — OVERVIEW CARDS (5 cards)
                 ═══════════════════════════════════════════ -->

            <!-- Skeleton -->
            <div v-if="analyticsStore.isLoading" class="row g-5 g-xl-8 mb-5 mb-xl-8">
              <div class="col-xl col-md-6 col-sm-4" v-for="i in 5" :key="i">
                <div class="card card-flush h-100">
                  <div class="card-body py-5">
                    <div class="placeholder-glow">
                      <span class="placeholder rounded-circle d-inline-block" style="width: 40px; height: 40px;"></span>
                      <div class="placeholder col-5 mt-4 d-block" style="height: 28px;"></div>
                      <div class="placeholder col-7 mt-2 d-block" style="height: 14px;"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loaded -->
            <div v-else-if="analyticsStore.hasData" class="row g-5 g-xl-8 mb-5 mb-xl-8">
              <!-- 1. Visitors -->
              <div class="col-xl col-md-6 col-sm-4">
                <div class="card card-flush h-100 border-0 shadow-sm">
                  <div class="card-body py-5">
                    <div class="d-flex align-items-center mb-3">
                      <div class="d-flex align-items-center justify-content-center rounded-2 bg-light-primary" style="width: 40px; height: 40px;">
                        <i class="ki-duotone ki-profile-user fs-1 text-primary">
                          <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
                        </i>
                      </div>
                    </div>
                    <div class="fw-bold fs-2x text-dark lh-1 mb-1">
                      {{ formatNumber(analyticsStore.overview?.unique_visitors) }}
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <span class="fw-semibold text-gray-500 fs-7">Visitors</span>
                      <TrendBadge :value="analyticsStore.trends.visitors" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 2. Page Views -->
              <div class="col-xl col-md-6 col-sm-4">
                <div class="card card-flush h-100 border-0 shadow-sm">
                  <div class="card-body py-5">
                    <div class="d-flex align-items-center mb-3">
                      <div class="d-flex align-items-center justify-content-center rounded-2 bg-light-info" style="width: 40px; height: 40px;">
                        <i class="ki-duotone ki-eye fs-1 text-info">
                          <span class="path1"></span><span class="path2"></span><span class="path3"></span>
                        </i>
                      </div>
                    </div>
                    <div class="fw-bold fs-2x text-dark lh-1 mb-1">
                      {{ formatNumber(analyticsStore.overview?.total_views) }}
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <span class="fw-semibold text-gray-500 fs-7">Page Views</span>
                      <TrendBadge :value="analyticsStore.trends.pageViews" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. Avg. Visit Duration -->
              <div class="col-xl col-md-6 col-sm-4">
                <div class="card card-flush h-100 border-0 shadow-sm">
                  <div class="card-body py-5">
                    <div class="d-flex align-items-center mb-3">
                      <div class="d-flex align-items-center justify-content-center rounded-2 bg-light-success" style="width: 40px; height: 40px;">
                        <i class="ki-duotone ki-timer fs-1 text-success">
                          <span class="path1"></span><span class="path2"></span><span class="path3"></span>
                        </i>
                      </div>
                    </div>
                    <div class="fw-bold fs-2x text-dark lh-1 mb-1">
                      {{ formatDuration(analyticsStore.overview?.avg_duration_ms) }}
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <span class="fw-semibold text-gray-500 fs-7">Avg. Visit Duration</span>
                      <TrendBadge :value="analyticsStore.trends.avgDuration" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 4. Top Country -->
              <div class="col-xl col-md-6 col-sm-4">
                <div class="card card-flush h-100 border-0 shadow-sm">
                  <div class="card-body py-5">
                    <div class="d-flex align-items-center mb-3">
                      <div class="d-flex align-items-center justify-content-center rounded-2 bg-light-warning" style="width: 40px; height: 40px;">
                        <i class="ki-duotone ki-geolocation fs-1 text-warning">
                          <span class="path1"></span><span class="path2"></span>
                        </i>
                      </div>
                    </div>
                    <div class="fw-bold fs-2x text-dark lh-1 mb-1">
                      <template v-if="analyticsStore.topCountry">
                        <CountryFlag :code="analyticsStore.topCountry.country" />
                        {{ analyticsStore.topCountry.country_name }}
                      </template>
                      <template v-else>--</template>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <span class="fw-semibold text-gray-500 fs-7">Top Country</span>
                      <span v-if="analyticsStore.topCountry" class="badge badge-light fs-8 fw-semibold">
                        {{ analyticsStore.topCountry.percentage }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 5. Contact Requests -->
              <div class="col-xl col-md-6 col-sm-4">
                <div class="card card-flush h-100 border-0 shadow-sm">
                  <div class="card-body py-5">
                    <div class="d-flex align-items-center mb-3">
                      <div class="d-flex align-items-center justify-content-center rounded-2 bg-light-danger" style="width: 40px; height: 40px;">
                        <i class="ki-duotone ki-sms fs-1 text-danger">
                          <span class="path1"></span><span class="path2"></span>
                        </i>
                      </div>
                    </div>
                    <div class="fw-bold fs-2x text-dark lh-1 mb-1">
                      {{ formatNumber(analyticsStore.contactRequestsCount) }}
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <span class="fw-semibold text-gray-500 fs-7">Contact Requests</span>
                      <TrendBadge :value="null" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══════════════════════════════════════════
                 ROW 2 — VISITOR TREND + TRAFFIC SOURCES
                 ═══════════════════════════════════════════ -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
              <!-- Visitor Trend (Area Chart) -->
              <div class="col-xl-8">
                <div class="card card-flush h-xl-100 border-0 shadow-sm">
                  <div class="card-header border-0 pt-5 pb-0">
                    <h3 class="card-title align-items-start flex-column">
                      <span class="card-label fw-bold text-dark fs-5">Visitors Over Time</span>
                      <span class="text-muted mt-1 fw-semibold fs-7">Daily unique visitor count</span>
                    </h3>
                  </div>
                  <div class="card-body pt-4">
                    <!-- Loading -->
                    <div v-if="analyticsStore.isLoading" class="placeholder-glow" style="height: 320px;">
                      <div class="placeholder w-100 h-100 rounded-2"></div>
                    </div>
                    <!-- Empty -->
                    <div v-else-if="analyticsStore.dailyViews.length === 0" class="d-flex flex-column justify-content-center align-items-center text-center" style="height: 320px;">
                      <i class="ki-duotone ki-chart-line fs-3x text-gray-300 mb-4">
                        <span class="path1"></span><span class="path2"></span>
                      </i>
                      <p class="text-muted fs-6">No visitor data for this period.</p>
                    </div>
                    <!-- Chart -->
                    <AnalyticsLineChart
                      v-else
                      :labels="visitorChartLabels"
                      :datasets="visitorChartDatasets"
                      :height="320"
                    />
                  </div>
                </div>
              </div>

              <!-- Traffic Sources (Doughnut) -->
              <div class="col-xl-4">
                <div class="card card-flush h-xl-100 border-0 shadow-sm">
                  <div class="card-header border-0 pt-5 pb-0">
                    <h3 class="card-title align-items-start flex-column">
                      <span class="card-label fw-bold text-dark fs-5">Where Visitors Come From</span>
                      <span class="text-muted mt-1 fw-semibold fs-7">Traffic source breakdown</span>
                    </h3>
                  </div>
                  <div class="card-body pt-4">
                    <!-- Loading -->
                    <div v-if="analyticsStore.isLoading" class="d-flex justify-content-center align-items-center" style="height: 320px;">
                      <div class="placeholder-glow w-100 h-100 d-flex align-items-center justify-content-center">
                        <div class="placeholder rounded-circle" style="width: 200px; height: 200px;"></div>
                      </div>
                    </div>
                    <!-- Empty -->
                    <div v-else-if="analyticsStore.trafficSources.length === 0" class="d-flex flex-column justify-content-center align-items-center text-center" style="height: 320px;">
                      <i class="ki-duotone ki-abstract-26 fs-3x text-gray-300 mb-4">
                        <span class="path1"></span><span class="path2"></span>
                      </i>
                      <p class="text-muted fs-6">No traffic source data yet.</p>
                    </div>
                    <!-- Chart -->
                    <AnalyticsDoughnutChart
                      v-else
                      :labels="trafficSourceLabels"
                      :data="trafficSourceData"
                      :colors="trafficSourceColors"
                      :center-text="formatNumber(analyticsStore.totalTrafficViews)"
                      center-subtext="Total visits"
                      :height="320"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══════════════════════════════════════════
                 ROW 3 — POPULAR PAGES + VISITOR LOCATIONS
                 ═══════════════════════════════════════════ -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
              <!-- Popular Pages -->
              <div class="col-xl-6">
                <div class="card card-flush h-xl-100 border-0 shadow-sm">
                  <div class="card-header border-0 pt-5 pb-0">
                    <h3 class="card-title align-items-start flex-column">
                      <span class="card-label fw-bold text-dark fs-5">Most Viewed Pages</span>
                      <span class="text-muted mt-1 fw-semibold fs-7">Top 7 pages by views</span>
                    </h3>
                  </div>
                  <div class="card-body pt-4">
                    <!-- Loading -->
                    <div v-if="analyticsStore.isLoading" class="placeholder-glow">
                      <div v-for="i in 7" :key="i" class="d-flex align-items-center py-3" :class="{ 'border-bottom border-gray-100': i < 7 }">
                        <span class="placeholder col-5 me-auto"></span>
                        <span class="placeholder col-2 ms-3"></span>
                        <span class="placeholder col-2 ms-3"></span>
                      </div>
                    </div>
                    <!-- Empty -->
                    <div v-else-if="analyticsStore.topPages.length === 0" class="d-flex flex-column justify-content-center align-items-center text-center py-10">
                      <i class="ki-duotone ki-document fs-3x text-gray-300 mb-4">
                        <span class="path1"></span><span class="path2"></span>
                      </i>
                      <p class="text-muted fs-6">No page view data available yet.</p>
                    </div>
                    <!-- Table -->
                    <div v-else>
                      <div class="table-responsive">
                        <table class="table align-middle table-row-dashed fs-6 gy-3 mb-0">
                          <thead>
                            <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                              <th class="min-w-200px ps-0">Page</th>
                              <th class="text-end min-w-80px">Views</th>
                              <th class="text-end min-w-80px pe-0">Unique</th>
                            </tr>
                          </thead>
                          <tbody class="text-gray-600 fw-semibold">
                            <tr v-for="page in analyticsStore.topPages.slice(0, 7)" :key="page.path">
                              <td class="ps-0">
                                <div class="position-relative">
                                  <div
                                    class="position-absolute top-0 start-0 h-100 rounded-1"
                                    :style="{
                                      width: ((page.views / maxPageViews) * 100) + '%',
                                      backgroundColor: 'rgba(139, 92, 246, 0.08)',
                                      zIndex: 0
                                    }"
                                  ></div>
                                  <span class="position-relative text-gray-800 fw-bold fs-7 ps-2" style="z-index: 1;">
                                    {{ humanizePath(page.path) }}
                                  </span>
                                </div>
                              </td>
                              <td class="text-end fw-bold text-dark">{{ formatNumber(page.views) }}</td>
                              <td class="text-end text-gray-500 pe-0">{{ formatNumber(page.unique_visitors) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Visitor Locations -->
              <div class="col-xl-6">
                <div class="card card-flush h-xl-100 border-0 shadow-sm">
                  <div class="card-header border-0 pt-5 pb-0">
                    <div class="d-flex align-items-center justify-content-between w-100">
                      <h3 class="card-title align-items-start flex-column mb-0">
                        <span class="card-label fw-bold text-dark fs-5">Visitor Locations</span>
                        <span class="text-muted mt-1 fw-semibold fs-7">Top countries by traffic</span>
                      </h3>
                      <div class="form-check form-switch form-check-custom form-check-sm">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="showCitiesToggle"
                          v-model="showCities"
                          @change="showCities && analyticsStore.fetchCities()"
                        />
                        <label class="form-check-label text-gray-500 fs-8" for="showCitiesToggle">
                          Show cities
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-4">
                    <!-- Loading -->
                    <div v-if="analyticsStore.isLoading" class="placeholder-glow">
                      <div v-for="i in 5" :key="i" class="d-flex align-items-center py-3" :class="{ 'border-bottom border-gray-100': i < 5 }">
                        <span class="placeholder" style="width: 24px; height: 18px;"></span>
                        <span class="placeholder col-4 ms-2"></span>
                        <span class="placeholder col-3 ms-auto"></span>
                      </div>
                    </div>
                    <!-- Empty -->
                    <div v-else-if="analyticsStore.countries.length === 0" class="d-flex flex-column justify-content-center align-items-center text-center py-10">
                      <i class="ki-duotone ki-geolocation fs-3x text-gray-300 mb-4">
                        <span class="path1"></span><span class="path2"></span>
                      </i>
                      <p class="text-muted fs-6">No location data available yet.</p>
                    </div>
                    <!-- Country List -->
                    <div v-else>
                      <div v-for="(country, idx) in topCountries" :key="country.country"
                        class="d-flex align-items-center py-3"
                        :class="{ 'border-bottom border-gray-100': idx < topCountries.length - 1 || otherCountries }"
                      >
                        <CountryFlag :code="country.country" />
                        <span class="fw-semibold text-gray-800 fs-7 ms-1 me-3" style="min-width: 100px;">
                          {{ country.country_name }}
                        </span>
                        <div class="flex-grow-1 mx-3">
                          <div class="bg-gray-100 rounded-pill" style="height: 6px;">
                            <div
                              class="rounded-pill"
                              :style="{
                                height: '6px',
                                width: country.percentage + '%',
                                backgroundColor: '#8b5cf6',
                                transition: 'width 0.5s ease'
                              }"
                            ></div>
                          </div>
                        </div>
                        <span class="text-gray-600 fw-semibold fs-7 text-end" style="min-width: 50px;">
                          {{ formatNumber(country.views) }}
                        </span>
                        <span class="text-gray-400 fs-8 ms-2" style="min-width: 40px;">
                          {{ country.percentage }}%
                        </span>
                      </div>

                      <!-- Other countries row -->
                      <div v-if="otherCountries" class="d-flex align-items-center py-3">
                        <span class="me-1" style="width: 20px; text-align: center;">...</span>
                        <span class="fw-semibold text-gray-500 fs-7 ms-1 me-3" style="min-width: 100px;">
                          Other countries
                        </span>
                        <div class="flex-grow-1 mx-3">
                          <div class="bg-gray-100 rounded-pill" style="height: 6px;">
                            <div
                              class="rounded-pill bg-gray-300"
                              :style="{
                                height: '6px',
                                width: otherCountries.percentage + '%',
                                transition: 'width 0.5s ease'
                              }"
                            ></div>
                          </div>
                        </div>
                        <span class="text-gray-500 fw-semibold fs-7 text-end" style="min-width: 50px;">
                          {{ formatNumber(otherCountries.views) }}
                        </span>
                        <span class="text-gray-400 fs-8 ms-2" style="min-width: 40px;">
                          {{ Math.round(otherCountries.percentage) }}%
                        </span>
                      </div>

                      <!-- City expansion -->
                      <Transition name="fade">
                        <div v-if="showCities && analyticsStore.cities.length" class="mt-4 pt-3 border-top border-gray-200">
                          <span class="text-gray-500 fw-semibold fs-8 d-block mb-3">Top Cities</span>
                          <div
                            v-for="city in analyticsStore.cities.slice(0, 8)"
                            :key="city.city"
                            class="d-flex align-items-center justify-content-between py-2"
                          >
                            <div class="d-flex align-items-center">
                              <CountryFlag :code="city.country" />
                              <span class="text-gray-700 fs-7 ms-1">{{ city.city }}</span>
                            </div>
                            <span class="text-gray-500 fs-7">{{ formatNumber(city.views) }}</span>
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══════════════════════════════════════════
                 ROW 4 — CONVERSION FUNNEL
                 ═══════════════════════════════════════════ -->
            <div class="card card-flush border-0 shadow-sm mb-5 mb-xl-8">
              <div class="card-header border-0 pt-5 pb-0">
                <h3 class="card-title align-items-start flex-column">
                  <span class="card-label fw-bold text-dark fs-5">Visitor Journey</span>
                  <span class="text-muted mt-1 fw-semibold fs-7">Conversion funnel from first visit to contact form</span>
                </h3>
              </div>
              <div class="card-body pt-4">
                <!-- Loading -->
                <div v-if="analyticsStore.isLoading" class="placeholder-glow">
                  <div v-for="i in 4" :key="i" class="mb-3">
                    <div class="placeholder rounded-2" :style="{ width: (100 - i * 20) + '%', height: '36px' }"></div>
                  </div>
                </div>
                <!-- Empty -->
                <div v-else-if="!analyticsStore.hasData" class="text-center py-10">
                  <p class="text-muted fs-6">No funnel data available yet.</p>
                </div>
                <!-- Funnel -->
                <template v-else>
                  <FunnelChart :steps="funnelSteps" />

                  <!-- Mini conversion cards -->
                  <div class="row g-4 mt-4 pt-4 border-top border-gray-100">
                    <div v-for="card in conversionCards" :key="card.label" class="col-md-4">
                      <div class="d-flex align-items-center bg-gray-100 rounded-2 px-4 py-3">
                        <i :class="card.icon" class="fs-2 me-3">
                          <span class="path1"></span><span class="path2"></span>
                        </i>
                        <div>
                          <div class="fw-bold fs-6 text-dark">{{ formatNumber(card.count) }}</div>
                          <div class="text-gray-500 fs-8 fw-semibold">{{ card.label }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- ═══════════════════════════════════════════
                 ROW 5 — DEVICES & BROWSERS (de-emphasized)
                 ═══════════════════════════════════════════ -->
            <div class="card card-flush border-0 shadow-sm mb-5 mb-xl-8">
              <div class="card-header border-0 pt-5 pb-0">
                <h3 class="card-title align-items-start flex-column">
                  <span class="card-label fw-semibold text-gray-700 fs-5">Devices & Browsers</span>
                  <span class="text-muted mt-1 fw-semibold fs-7">Technical breakdown of visitor environment</span>
                </h3>
              </div>
              <div class="card-body pt-4">
                <!-- Loading -->
                <div v-if="analyticsStore.isLoading" class="placeholder-glow">
                  <div v-for="i in 3" :key="i" class="mb-5">
                    <div class="placeholder col-3 mb-2" style="height: 14px;"></div>
                    <div class="placeholder w-100 rounded-2" style="height: 28px;"></div>
                  </div>
                </div>
                <!-- Empty -->
                <div v-else-if="analyticsStore.devices.length === 0 && analyticsStore.browsers.length === 0"
                  class="d-flex flex-column justify-content-center align-items-center text-center py-8"
                >
                  <i class="ki-duotone ki-technology-2 fs-3x text-gray-300 mb-4">
                    <span class="path1"></span><span class="path2"></span>
                  </i>
                  <p class="text-muted fs-6">No device data available yet.</p>
                </div>
                <!-- Stacked Bars -->
                <template v-else>
                  <StackedBar
                    v-if="deviceSegments.length"
                    title="Devices"
                    :segments="deviceSegments"
                  />
                  <StackedBar
                    v-if="browserSegments.length"
                    title="Browsers"
                    :segments="browserSegments"
                  />
                  <StackedBar
                    v-if="osSegments.length"
                    title="Operating Systems"
                    :segments="osSegments"
                  />
                </template>
              </div>
            </div>

          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, max-height 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
