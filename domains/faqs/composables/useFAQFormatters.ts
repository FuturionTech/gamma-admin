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

  const formatDate = (dateString: string): string => {
    if (!dateString) return ''

    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return ''

    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
    formatDateTime,
    stripHtmlTags,
    getAnswerPreview
  }
}
