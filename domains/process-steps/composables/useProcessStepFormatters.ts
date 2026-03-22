import type { ProcessStep } from '../types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)

export const useProcessStepFormatters = () => {
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
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  /**
   * Get icon display (icon value or default)
   */
  const getIconDisplay = (processStep: ProcessStep): string => {
    return processStep.icon || 'ki-duotone ki-abstract-26'
  }

  /**
   * Format step number with leading zero
   */
  const formatStepNumber = (stepNumber: number): string => {
    return stepNumber.toString().padStart(2, '0')
  }

  return {
    formatDate,
    formatRelativeDate,
    formatDateTime,
    getStatusBadgeClass,
    getStatusText,
    truncate,
    generateSlug,
    getIconDisplay,
    formatStepNumber
  }
}
