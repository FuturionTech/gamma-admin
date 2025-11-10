import type { Certification, FileType } from '../types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)

export const useCertificationFormatters = () => {
  /**
   * Format date to localized string
   */
  const formatDate = (dateString: string, format: string = 'DD MMM YYYY'): string => {
    if (!dateString) return ''
    try {
      return dayjs(dateString).format(format)
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
      return dayjs(dateString).fromNow()
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
  const getCategoryBadgeClass = (categoryName: string | null): string => {
    if (!categoryName) return 'badge-light-secondary'

    const categoryColors: Record<string, string> = {
      'ISO Certifications': 'badge-light-primary',
      'Awards & Recognition': 'badge-light-warning',
      'Industry Partnerships': 'badge-light-info',
      'Compliance Certifications': 'badge-light-danger',
      'Quality Standards': 'badge-light-success'
    }

    return categoryColors[categoryName] || 'badge-light-secondary'
  }

  /**
   * Format category name
   */
  const formatCategory = (categoryName: string | null): string => {
    if (!categoryName) return 'N/A'
    return categoryName
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
   * Get file type from URL
   */
  const getFileType = (fileUrl: string): FileType => {
    const extension = fileUrl.split('.').pop()?.toLowerCase()
    if (extension === 'pdf') return 'pdf'
    return 'image'
  }

  /**
   * Get file extension from URL
   */
  const getFileExtension = (fileUrl: string): string => {
    return fileUrl.split('.').pop()?.toUpperCase() || 'FILE'
  }

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Check if certification is recent (less than 1 year old)
   */
  const isRecent = (issuedDate: string | null): boolean => {
    if (!issuedDate) return false
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const issued = new Date(issuedDate)
    return issued >= oneYearAgo
  }

  /**
   * Get certification age in years
   */
  const getCertificationAge = (issuedDate: string | null): string => {
    if (!issuedDate) return 'N/A'
    const issued = dayjs(issuedDate)
    const now = dayjs()
    const years = now.diff(issued, 'year')
    if (years === 0) {
      const months = now.diff(issued, 'month')
      return months === 0 ? 'Less than a month' : `${months} month${months > 1 ? 's' : ''}`
    }
    return `${years} year${years > 1 ? 's' : ''}`
  }

  /**
   * Get certification display name with category
   */
  const getCertificationDisplayName = (certification: Certification): string => {
    if (certification.category) {
      return `${certification.title} (${certification.category.name})`
    }
    return certification.title
  }

  /**
   * Validate file type
   */
  const isValidFileType = (file: File): boolean => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    return validTypes.includes(file.type)
  }

  /**
   * Get file type icon class
   */
  const getFileIconClass = (fileUrl: string): string => {
    const type = getFileType(fileUrl)
    if (type === 'pdf') {
      return 'ki-file fs-2x text-danger'
    }
    return 'ki-picture fs-2x text-primary'
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
    getFileType,
    getFileExtension,
    formatFileSize,
    isRecent,
    getCertificationAge,
    getCertificationDisplayName,
    isValidFileType,
    getFileIconClass
  }
}
