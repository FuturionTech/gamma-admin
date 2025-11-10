import type { Stat } from '../types'
import dayjs from 'dayjs'

export const useStatFormatters = () => {
  /**
   * Format a date string to human-readable format
   */
  const formatDate = (dateString: string, format: string = 'DD/MM/YYYY'): string => {
    if (!dateString) return '-'
    return dayjs(dateString).format(format)
  }

  /**
   * Format a date to relative time (e.g., "il y a 2 jours")
   */
  const formatRelativeTime = (dateString: string): string => {
    if (!dateString) return '-'
    return dayjs(dateString).fromNow()
  }

  /**
   * Format stat display value with unit
   */
  const formatStatValue = (stat: Stat): string => {
    if (!stat.value) return '-'

    const value = stat.value
    const unit = stat.unit || ''

    return `${value}${unit}`
  }

  /**
   * Get status badge class based on active state
   */
  const getStatusBadgeClass = (isActive: boolean): string => {
    return isActive ? 'badge-light-success' : 'badge-light-danger'
  }

  /**
   * Get status text based on active state
   */
  const getStatusText = (isActive: boolean): string => {
    return isActive ? 'Active' : 'Inactive'
  }

  /**
   * Format icon class for FontAwesome
   */
  const formatIconClass = (icon?: string | null): string => {
    if (!icon) return 'fa-chart-bar' // Default icon

    // If it already has 'fa' prefix, return as is
    if (icon.startsWith('fa-') || icon.startsWith('fas ') || icon.startsWith('far ')) {
      return icon
    }

    // Otherwise add fa- prefix
    return `fa-${icon}`
  }

  /**
   * Get full icon HTML classes for FontAwesome
   */
  const getIconClasses = (icon?: string | null): string => {
    const iconClass = formatIconClass(icon)

    // Determine the icon style (solid, regular, etc.)
    if (iconClass.startsWith('far ')) {
      return iconClass
    } else if (iconClass.startsWith('fas ')) {
      return iconClass
    }

    // Default to solid
    return `fas ${iconClass}`
  }

  /**
   * Truncate long text
   */
  const truncate = (text: string, maxLength: number = 50): string => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  /**
   * Highlight search term in text
   */
  const highlightSearchTerm = (text: string, searchTerm: string): string => {
    if (!searchTerm || !text) return text

    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  /**
   * Format stat for preview/display
   */
  const formatStatPreview = (stat: Stat): string => {
    const value = formatStatValue(stat)
    return `${value} - ${stat.label}`
  }

  /**
   * Get order display text
   */
  const formatOrder = (order: number): string => {
    return `Position ${order}`
  }

  return {
    formatDate,
    formatRelativeTime,
    formatStatValue,
    getStatusBadgeClass,
    getStatusText,
    formatIconClass,
    getIconClasses,
    truncate,
    highlightSearchTerm,
    formatStatPreview,
    formatOrder
  }
}
