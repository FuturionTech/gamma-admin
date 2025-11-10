import dayjs from 'dayjs'

export const useTeamFormatters = () => {
  /**
   * Truncate text to specified length
   */
  const truncate = (text: string | null | undefined, maxLength: number = 50): string => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  /**
   * Format date to localized string
   */
  const formatDate = (date: string | null | undefined): string => {
    if (!date) return ''
    return dayjs(date).format('DD/MM/YYYY')
  }

  /**
   * Format date with time
   */
  const formatDateTime = (date: string | null | undefined): string => {
    if (!date) return ''
    return dayjs(date).format('DD/MM/YYYY HH:mm')
  }

  /**
   * Get badge class for status
   */
  const getStatusBadgeClass = (isActive: boolean): string => {
    return isActive ? 'badge-success' : 'badge-danger'
  }

  /**
   * Get status text
   */
  const getStatusText = (isActive: boolean): string => {
    return isActive ? 'Active' : 'Inactive'
  }

  /**
   * Get role badge color class
   */
  const getRoleBadgeClass = (role: string | null | undefined): string => {
    if (!role) return 'badge-secondary'

    const roleColors: Record<string, string> = {
      'CEO': 'badge-primary',
      'CTO': 'badge-info',
      'CFO': 'badge-success',
      'COO': 'badge-warning',
      'Developer': 'badge-light-primary',
      'Designer': 'badge-light-info',
      'Manager': 'badge-light-success',
      'Director': 'badge-light-warning'
    }

    return roleColors[role] || 'badge-secondary'
  }

  /**
   * Format phone number
   */
  const formatPhoneNumber = (phone: string | null | undefined): string => {
    if (!phone) return ''
    // Simple formatting - can be enhanced based on locale
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
  }

  /**
   * Get initials from name
   */
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return '??'
    const parts = name.trim().split(' ')
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase()
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  /**
   * Get avatar background color based on name
   */
  const getAvatarColor = (name: string | null | undefined): string => {
    if (!name) return 'bg-secondary'

    const colors = [
      'bg-primary',
      'bg-success',
      'bg-info',
      'bg-warning',
      'bg-danger',
      'bg-dark'
    ]

    const charCode = name.charCodeAt(0) + name.charCodeAt(name.length - 1)
    return colors[charCode % colors.length]
  }

  return {
    truncate,
    formatDate,
    formatDateTime,
    getStatusBadgeClass,
    getStatusText,
    getRoleBadgeClass,
    formatPhoneNumber,
    getInitials,
    getAvatarColor
  }
}
