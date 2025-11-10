import type { Client } from '../types'

export const useClientFormatters = () => {

  /**
   * Truncate text to a specified length
   */
  const truncate = (text: string | null | undefined, maxLength: number): string => {
    if (!text) return ''
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  /**
   * Format date
   */
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    } catch (error) {
      return dateString
    }
  }

  /**
   * Format date with time
   */
  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch (error) {
      return dateString
    }
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
   * Get industry badge class
   */
  const getIndustryBadgeClass = (industry: string | null | undefined): string => {
    if (!industry) return 'badge-light-secondary'

    const industryClasses: Record<string, string> = {
      'Finance': 'badge-light-success',
      'Healthcare': 'badge-light-info',
      'Education': 'badge-light-primary',
      'Retail': 'badge-light-warning',
      'Manufacturing': 'badge-light-danger',
      'Technology': 'badge-light-dark',
      'Energy': 'badge-light-success',
      'Telecommunications': 'badge-light-info',
      'Transportation': 'badge-light-primary',
      'Real Estate': 'badge-light-warning',
      'Government': 'badge-light-danger',
      'Other': 'badge-light-secondary'
    }

    return industryClasses[industry] || 'badge-light-secondary'
  }

  /**
   * Generate a URL-friendly slug from a name
   */
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  /**
   * Format website URL for display
   */
  const formatWebsiteUrl = (url: string | null | undefined): string => {
    if (!url) return ''
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }

  /**
   * Get initials from client name
   */
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return {
    truncate,
    formatDate,
    formatDateTime,
    getStatusBadgeClass,
    getStatusText,
    getIndustryBadgeClass,
    generateSlug,
    formatWebsiteUrl,
    getInitials
  }
}
