import type { Service } from '../types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)

export const useServiceFormatters = () => {
  /**
   * Format date to localized string
   */
  const formatDate = (dateString: string, format: string = 'DD MMM YYYY'): string => {
    if (!dateString) return ''
    try {
      return dayjs(dateString).locale('en').format(format)
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
      return dayjs(dateString).locale('en').fromNow()
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
   * Get category badge class
   */
  const getCategoryBadgeClass = (category: string | null): string => {
    if (!category) return 'badge-light-secondary'

    const categoryColors: Record<string, string> = {
      'AI': 'badge-light-primary',
      'Data Engineering': 'badge-light-info',
      'Cybersecurity': 'badge-light-danger',
      'Cloud': 'badge-light-success',
      'DevOps': 'badge-light-warning',
      'Consulting': 'badge-light-dark'
    }

    return categoryColors[category] || 'badge-light-secondary'
  }

  /**
   * Format category name
   */
  const formatCategory = (category: string | null): string => {
    if (!category) return 'N/A'
    return category
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
   * Get icon display (icon URL or default icon)
   */
  const getIconDisplay = (service: Service): string => {
    return service.icon || '/assets/media/icons/duotune/general/gen025.svg'
  }

  /**
   * Format service title with category
   */
  const getServiceDisplayName = (service: Service): string => {
    if (service.category) {
      return `${service.title} (${service.category})`
    }
    return service.title
  }

  return {
    formatDate,
    formatRelativeDate,
    formatDateTime,
    getStatusBadgeClass,
    getStatusText,
    getCategoryBadgeClass,
    formatCategory,
    truncate,
    generateSlug,
    getIconDisplay,
    getServiceDisplayName
  }
}
