export const useTestimonialFormatters = () => {
  /**
   * Truncate text to specified length
   */
  const truncate = (text: string, length: number = 100): string => {
    if (!text) return ''
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }

  /**
   * Format date to localized string
   */
  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      month: '2-digit',
      day: '2-digit'
    }).format(date)
  }

  /**
   * Get status badge class based on is_active
   */
  const getStatusBadgeClass = (isActive: boolean): string => {
    return isActive
      ? 'badge-light-success'
      : 'badge-light-danger'
  }

  /**
   * Get status text
   */
  const getStatusText = (isActive: boolean): string => {
    return isActive ? 'Active' : 'Inactive'
  }

  /**
   * Get rating badge class
   */
  const getRatingBadgeClass = (rating: number): string => {
    if (rating >= 4) return 'badge-light-success'
    if (rating >= 3) return 'badge-light-primary'
    if (rating >= 2) return 'badge-light-warning'
    return 'badge-light-danger'
  }

  /**
   * Get rating text with stars
   */
  const getRatingText = (rating: number): string => {
    return `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`
  }

  /**
   * Generate initials from name
   */
  const getInitials = (name: string): string => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase()
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  /**
   * Get avatar background color based on name
   */
  const getAvatarColor = (name: string): string => {
    if (!name) return 'bg-secondary'
    const colors = [
      'bg-primary',
      'bg-success',
      'bg-info',
      'bg-warning',
      'bg-danger'
    ]
    const charCode = name.charCodeAt(0)
    return colors[charCode % colors.length]
  }

  /**
   * Format testimonial content for display
   */
  const formatTestimonialContent = (content: string, maxLength: number = 200): string => {
    return truncate(content, maxLength)
  }

  /**
   * Get character count display
   */
  const getCharacterCount = (text: string, maxLength: number = 500): string => {
    const count = text?.length || 0
    return `${count}/${maxLength}`
  }

  /**
   * Check if character limit exceeded
   */
  const isCharacterLimitExceeded = (text: string, maxLength: number = 500): boolean => {
    return (text?.length || 0) > maxLength
  }

  return {
    truncate,
    formatDate,
    formatDateShort,
    getStatusBadgeClass,
    getStatusText,
    getRatingBadgeClass,
    getRatingText,
    getInitials,
    getAvatarColor,
    formatTestimonialContent,
    getCharacterCount,
    isCharacterLimitExceeded
  }
}
