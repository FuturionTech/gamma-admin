import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)

export const useFAQFormatters = () => {
  const truncate = (text: string, maxLength: number = 100): string => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getStatusBadgeClass = (isActive: boolean): string => {
    return isActive ? 'badge-light-success' : 'badge-light-danger'
  }

  const getStatusText = (isActive: boolean): string => {
    return isActive ? 'Active' : 'Inactive'
  }

  const getCategoryBadgeClass = (category: string): string => {
    const categoryClasses: Record<string, string> = {
      'General': 'badge-light-primary',
      'Pricing': 'badge-light-success',
      'Technical': 'badge-light-info',
      'Support': 'badge-light-warning',
      'Services': 'badge-light-primary',
      'Security': 'badge-light-danger',
      'Uncategorized': 'badge-light-secondary'
    }

    return categoryClasses[category] || 'badge-light-secondary'
  }

  const formatDate = (dateString: string, format: string = 'DD MMM YYYY'): string => {
    if (!dateString) return ''
    try {
      return dayjs(dateString).locale('en').format(format)
    } catch (error) {
      return dateString
    }
  }

  const formatRelativeDate = (dateString: string): string => {
    if (!dateString) return ''
    try {
      return dayjs(dateString).locale('en').fromNow()
    } catch (error) {
      return dateString
    }
  }

  const formatDateTime = (dateString: string): string => {
    return formatDate(dateString, 'DD MMM YYYY HH:mm')
  }

  const stripHtmlTags = (html: string): string => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  const getAnswerPreview = (answer: string, maxLength: number = 150): string => {
    const plainText = stripHtmlTags(answer)
    return truncate(plainText, maxLength)
  }

  return {
    truncate,
    getStatusBadgeClass,
    getStatusText,
    getCategoryBadgeClass,
    formatDate,
    formatRelativeDate,
    formatDateTime,
    stripHtmlTags,
    getAnswerPreview
  }
}
