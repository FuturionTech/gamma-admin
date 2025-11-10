import type { PostStatus } from '../types'

export const useBlogFormatters = () => {
  /**
   * Truncate text to a specific length
   */
  const truncate = (text: string, length: number = 100): string => {
    if (!text) return ''
    return text.length > length ? text.substring(0, length) + '...' : text
  }

  /**
   * Format date to localized string
   */
  const formatDate = (dateString: string): string => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Format date to short format
   */
  const formatDateShort = (dateString: string): string => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  /**
   * Format date and time
   */
  const formatDateTime = (dateString: string): string => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Get status badge class
   */
  const getStatusBadgeClass = (status: PostStatus): string => {
    const statusMap: Record<PostStatus, string> = {
      published: 'badge-success',
      draft: 'badge-warning'
    }
    return statusMap[status] || 'badge-secondary'
  }

  /**
   * Get status text
   */
  const getStatusText = (status: PostStatus): string => {
    const statusMap: Record<PostStatus, string> = {
      published: 'Published',
      draft: 'Draft'
    }
    return statusMap[status] || status
  }

  /**
   * Get category badge class
   */
  const getCategoryBadgeClass = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'AI': 'badge-primary',
      'Tech Trends': 'badge-info',
      'Innovation': 'badge-success',
      'Tutorial': 'badge-warning',
      'News': 'badge-danger'
    }
    return categoryMap[category] || 'badge-light-primary'
  }

  /**
   * Format view count
   */
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K'
    }
    return count.toString()
  }

  /**
   * Get author full name
   */
  const getAuthorName = (author: { first_name: string; last_name: string } | null | undefined): string => {
    if (!author) return 'Anonymous'
    return `${author.first_name} ${author.last_name}`
  }

  /**
   * Strip HTML tags from content
   */
  const stripHtml = (html: string): string => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  /**
   * Calculate reading time
   */
  const calculateReadingTime = (content: string): number => {
    if (!content) return 0
    const text = stripHtml(content)
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  /**
   * Format tags as string
   */
  const formatTags = (tags: string[] | null | undefined): string => {
    if (!tags || tags.length === 0) return '—'
    return tags.join(', ')
  }

  return {
    truncate,
    formatDate,
    formatDateShort,
    formatDateTime,
    getStatusBadgeClass,
    getStatusText,
    getCategoryBadgeClass,
    formatViewCount,
    getAuthorName,
    stripHtml,
    calculateReadingTime,
    formatTags
  }
}
