import type { Industry } from '../types'
import { IndustryCategory, INDUSTRY_CATEGORY_CONFIG } from '../types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)

export const useIndustryFormatters = () => {
  /**
   * Format date to localized string
   */
  const formatDate = (dateString: string, format: string = 'DD MMM YYYY'): string => {
    if (!dateString) return ''
    try {
      return dayjs(dateString).locale('en').format(format)
    } catch (error) {
      return dateString
    }
  }

  /**
   * Format date to relative time (e.g., "2 hours ago")
   */
  const formatRelativeDate = (dateString: string): string => {
    if (!dateString) return ''
    try {
      return dayjs(dateString).locale('en').fromNow()
    } catch (error) {
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
   * Get category badge class from enum
   */
  const getCategoryBadgeClass = (category: IndustryCategory | string | null): string => {
    if (!category) return 'badge-light-secondary'
    const config = INDUSTRY_CATEGORY_CONFIG[category as IndustryCategory]
    return config?.badgeClass || 'badge-light-secondary'
  }

  /**
   * Get category icon from enum
   */
  const getCategoryIcon = (category: IndustryCategory | string | null): string => {
    if (!category) return 'bi-question-circle'
    const config = INDUSTRY_CATEGORY_CONFIG[category as IndustryCategory]
    return config?.icon || 'bi-question-circle'
  }

  /**
   * Format category name from enum value
   */
  const formatCategory = (category: IndustryCategory | string | null): string => {
    if (!category) return 'N/A'
    const config = INDUSTRY_CATEGORY_CONFIG[category as IndustryCategory]
    return config?.label || category
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
   * Generate slug from title
   */
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD') // Normalize accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  }

  /**
   * Get icon display (icon value or default icon)
   */
  const getIconDisplay = (industry: Industry): string => {
    return industry.icon || '/assets/media/icons/duotune/general/gen025.svg'
  }

  /**
   * Format industry title with category
   */
  const getIndustryDisplayName = (industry: Industry): string => {
    if (industry.category) {
      return `${industry.title} (${formatCategory(industry.category)})`
    }
    return industry.title
  }

  return {
    formatDate,
    formatRelativeDate,
    formatDateTime,
    getStatusBadgeClass,
    getStatusText,
    getCategoryBadgeClass,
    getCategoryIcon,
    formatCategory,
    truncate,
    generateSlug,
    getIconDisplay,
    getIndustryDisplayName
  }
}
