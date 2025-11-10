import { gql } from '@apollo/client/core';

// Send Platform Announcement Mutation
export const SEND_PLATFORM_ANNOUNCEMENT = gql`
  mutation SendPlatformAnnouncement($input: PlatformAnnouncementInput!) {
    sendPlatformAnnouncement(input: $input) {
      success
      message
      announcementId
      sentTo
      scheduledFor
    }
  }
`;

// System Maintenance Mode Mutation
export const TOGGLE_MAINTENANCE_MODE = gql`
  mutation ToggleMaintenanceMode($input: MaintenanceModeInput!) {
    toggleMaintenanceMode(input: $input) {
      success
      message
      maintenanceMode
      scheduledStart
      scheduledEnd
      affectedServices
    }
  }
`;

// Export Platform Report Mutation
export const EXPORT_PLATFORM_REPORT = gql`
  mutation ExportPlatformReport($input: ExportReportInput!) {
    exportPlatformReport(input: $input) {
      success
      message
      reportId
      downloadUrl
      expiresAt
      format
    }
  }
`;

// Refresh System Health Check
export const REFRESH_SYSTEM_HEALTH = gql`
  mutation RefreshSystemHealth {
    refreshSystemHealth {
      success
      message
      lastChecked
      services {
        name
        status
        responseTime
      }
    }
  }
`;

// Clear Cache Mutation
export const CLEAR_PLATFORM_CACHE = gql`
  mutation ClearPlatformCache($input: ClearCacheInput!) {
    clearPlatformCache(input: $input) {
      success
      message
      clearedCaches
      totalSizeCleared
    }
  }
`;

// Update Dashboard Preferences
export const UPDATE_DASHBOARD_PREFERENCES = gql`
  mutation UpdateDashboardPreferences($input: DashboardPreferencesInput!) {
    updateDashboardPreferences(input: $input) {
      success
      message
      preferences {
        defaultDateRange
        favoriteMetrics
        chartPreferences
        refreshInterval
        emailReports
      }
    }
  }
`;