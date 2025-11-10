import type { Partner } from '../types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)

export const usePartnerFormatters = () => {
  const { locale } = useI18n()

  /**
   * Format date to localized string
   */
  const formatDate = (dateString: string, format: string = 'DD MMM YYYY'): string => {
    if (!dateString) return ''
    try {
      return dayjs(dateString).locale(locale.value).format(format)
    } catch (error) {
      console.error('Error formatting date:', error)
      return dateString
    }
  }

  /**
   * Format date to relative time (e.g., "2 hours ago")
   */
  const formatRelativeDate = (dateString: string): string => {
    if (!dateString) return ''
    try {
      return dayjs(dateString).locale(locale.value).fromNow()
    } catch (error) {
      console.error('Error formatting relative date:', error)
      return dateString
    }
  }

  /**
   * Format date with time
   */
  const formatDateTime = (dateString: string): string => {
    return formatDate(dateString, 'DD MMM YYYY HH:mm')
  }

  /**
   * Get status badge class
   */
  const getStatusBadgeClass = (isActive: boolean): string => {
    return isActive ? 'badge-light-success' : 'badge-light-danger'
  }

  /**
   * Get status text
   */
  const getStatusText = (isActive: boolean): string => {
    return isActive ? 'Active' : 'Inactive'
  }

  /**
   * Truncate text
   */
  const truncate = (text: string | null, length: number = 100): string => {
    if (!text) return ''
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }

  /**
   * Get logo display (logo URL or default logo)
   */
  const getLogoDisplay = (partner: Partner): string => {
    return partner.logo_url || '/assets/media/icons/duotune/general/gen025.svg'
  }

  /**
   * Validate URL format
   */
  const isValidUrl = (url: string): boolean => {
    if (!url) return true // Optional field
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * Format website URL for display
   */
  const formatWebsiteUrl = (url: string | null): string => {
    if (!url) return ''
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  return {
    formatDate,
    formatRelativeDate,
    formatDateTime,
    getStatusBadgeClass,
    getStatusText,
    truncate,
    getLogoDisplay,
    isValidUrl,
    formatWebsiteUrl
  }
}
