import { ProjectStatus } from '../types'

export const useProjectFormatters = () => {

  /**
   * Format date to localized string
   */
  const formatDate = (dateString: string): string => {
    if (!dateString) return ''

    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  /**
   * Format date to short format
   */
  const formatDateShort = (dateString: string): string => {
    if (!dateString) return ''

    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short'
    }).format(date)
  }

  /**
   * Truncate text to specified length
   */
  const truncate = (text: string | null | undefined, maxLength: number = 100): string => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  /**
   * Generate slug from title
   */
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  /**
   * Get status badge class
   */
  const getStatusBadgeClass = (status: ProjectStatus): string => {
    switch (status) {
      case ProjectStatus.PUBLISHED:
        return 'badge-success'
      case ProjectStatus.DRAFT:
        return 'badge-warning'
      default:
        return 'badge-secondary'
    }
  }

  /**
   * Get status text
   */
  const getStatusText = (status: ProjectStatus): string => {
    switch (status) {
      case ProjectStatus.PUBLISHED:
        return 'Published'
      case ProjectStatus.DRAFT:
        return 'Draft'
      default:
        return status
    }
  }

  /**
   * Get industry badge class
   */
  const getIndustryBadgeClass = (industry: string): string => {
    const colors = [
      'badge-primary',
      'badge-info',
      'badge-success',
      'badge-warning',
      'badge-danger',
      'badge-dark'
    ]

    // Generate a consistent color based on the industry name
    const index = industry.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  /**
   * Format technologies array to display string
   */
  const formatTechnologies = (technologies: string[] | null | undefined, maxDisplay: number = 3): string => {
    if (!technologies || technologies.length === 0) return '—'

    if (technologies.length <= maxDisplay) {
      return technologies.join(', ')
    }

    const displayed = technologies.slice(0, maxDisplay).join(', ')
    const remaining = technologies.length - maxDisplay
    return `${displayed} +${remaining}`
  }

  /**
   * Get completion year from date
   */
  const getCompletionYear = (dateString: string | null | undefined): number | null => {
    if (!dateString) return null

    const date = new Date(dateString)
    return date.getFullYear()
  }

  /**
   * Check if project is recent (completed in last year)
   */
  const isRecentProject = (completionDate: string | null | undefined): boolean => {
    if (!completionDate) return false

    const date = new Date(completionDate)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    return date >= oneYearAgo
  }

  /**
   * Format gallery images count
   */
  const formatGalleryCount = (galleryImages: string[] | null | undefined): string => {
    if (!galleryImages || galleryImages.length === 0) return 'No images'

    const count = galleryImages.length
    return count === 1 ? '1 image' : `${count} images`
  }

  return {
    formatDate,
    formatDateShort,
    truncate,
    generateSlug,
    getStatusBadgeClass,
    getStatusText,
    getIndustryBadgeClass,
    formatTechnologies,
    getCompletionYear,
    isRecentProject,
    formatGalleryCount
  }
}
