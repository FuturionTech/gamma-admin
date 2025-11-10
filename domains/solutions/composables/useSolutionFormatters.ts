import type { Solution } from '../types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)

export const useSolutionFormatters = () => {
  const { locale } = useI18n()

  const formatDate = (dateString: string, format: string = 'DD MMM YYYY'): string => {
    if (!dateString) return ''
    try {
      return dayjs(dateString).locale(locale.value).format(format)
    } catch (error) {
      console.error('Error formatting date:', error)
      return dateString
    }
  }

  const formatRelativeDate = (dateString: string): string => {
    if (!dateString) return ''
    try {
      return dayjs(dateString).locale(locale.value).fromNow()
    } catch (error) {
      console.error('Error formatting relative date:', error)
      return dateString
    }
  }

  const formatDateTime = (dateString: string): string => {
    return formatDate(dateString, 'DD MMM YYYY HH:mm')
  }

  const getStatusBadgeClass = (isActive: boolean): string => {
    return isActive ? 'badge-light-success' : 'badge-light-danger'
  }

  const getStatusText = (isActive: boolean): string => {
    return isActive ? 'Active' : 'Inactive'
  }

  const truncate = (text: string | null, length: number = 100): string => {
    if (!text) return ''
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }

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

  const getIconDisplay = (solution: Solution): string => {
    return solution.icon || '/assets/media/icons/duotune/general/gen025.svg'
  }

  const getSolutionDisplayName = (solution: Solution): string => {
    if (solution.subtitle) {
      return `${solution.title} - ${solution.subtitle}`
    }
    return solution.title
  }

  const getFeatureCount = (solution: Solution): number => {
    return solution.features?.length || 0
  }

  const getBenefitCount = (solution: Solution): number => {
    return solution.benefits?.length || 0
  }

  const isValidHexColor = (color: string): boolean => {
    if (!color) return false
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return hexRegex.test(color)
  }

  const getIconColorStyle = (solution: Solution): Record<string, string> => {
    if (solution.icon_color && isValidHexColor(solution.icon_color)) {
      return { color: solution.icon_color }
    }
    return {}
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
    getSolutionDisplayName,
    getFeatureCount,
    getBenefitCount,
    isValidHexColor,
    getIconColorStyle
  }
}
