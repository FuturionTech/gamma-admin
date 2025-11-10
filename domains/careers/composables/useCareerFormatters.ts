import { JobType, JobStatus, JOB_TYPE_LABELS, JOB_STATUS_LABELS } from '../types'
import dayjs from 'dayjs'

export const useCareerFormatters = () => {
  /**
   * Get badge class for job status
   */
  const getStatusBadgeClass = (status: JobStatus): string => {
    const classes: Record<JobStatus, string> = {
      [JobStatus.ACTIVE]: 'badge-light-success',
      [JobStatus.CLOSED]: 'badge-light-danger'
    }
    return classes[status] || 'badge-light-secondary'
  }

  /**
   * Get localized text for job status
   */
  const getStatusText = (status: JobStatus): string => {
    return JOB_STATUS_LABELS[status] || status
  }

  /**
   * Get badge class for job type
   */
  const getJobTypeBadgeClass = (jobType: JobType): string => {
    const classes: Record<JobType, string> = {
      [JobType.FULL_TIME]: 'badge-light-primary',
      [JobType.PART_TIME]: 'badge-light-info',
      [JobType.CONTRACT]: 'badge-light-warning'
    }
    return classes[jobType] || 'badge-light-secondary'
  }

  /**
   * Get localized text for job type
   */
  const getJobTypeText = (jobType: JobType): string => {
    return JOB_TYPE_LABELS[jobType] || jobType
  }

  /**
   * Get badge class for department
   */
  const getDepartmentBadgeClass = (department: string): string => {
    const colors = [
      'badge-light-primary',
      'badge-light-success',
      'badge-light-info',
      'badge-light-warning',
      'badge-light-danger'
    ]
    // Simple hash function to get consistent color for same department
    const hash = department.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  /**
   * Get badge class for remote status
   */
  const getRemoteBadgeClass = (isRemote: boolean): string => {
    return isRemote ? 'badge-light-success' : 'badge-light-secondary'
  }

  /**
   * Get text for remote status
   */
  const getRemoteText = (isRemote: boolean): string => {
    return isRemote ? 'Remote' : 'On-site'
  }

  /**
   * Format date to readable format
   */
  const formatDate = (date: string | Date): string => {
    if (!date) return ''
    return dayjs(date).format('DD/MM/YYYY')
  }

  /**
   * Format date to relative time
   */
  const formatRelativeDate = (date: string | Date): string => {
    if (!date) return ''
    const now = dayjs()
    const target = dayjs(date)
    const diffDays = now.diff(target, 'day')

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s) ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month(s) ago`
    return `${Math.floor(diffDays / 365)} year(s) ago`
  }

  /**
   * Truncate text to specified length
   */
  const truncateText = (text: string, maxLength: number = 100): string => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  /**
   * Format salary range
   */
  const formatSalaryRange = (salaryRange: string | null): string => {
    if (!salaryRange) return 'Not specified'
    return salaryRange
  }

  /**
   * Get initials from title for avatar
   */
  const getInitials = (title: string): string => {
    if (!title) return '??'
    const words = title.split(' ').filter(w => w.length > 0)
    if (words.length === 0) return '??'
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  /**
   * Strip HTML tags from description
   */
  const stripHtml = (html: string): string => {
    if (!html) return ''
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  /**
   * Count days since posting
   */
  const daysSincePosted = (postedDate: string): number => {
    if (!postedDate) return 0
    return dayjs().diff(dayjs(postedDate), 'day')
  }

  /**
   * Format array items for display
   */
  const formatArrayItems = (items: string[] | null, maxItems: number = 3): string => {
    if (!items || items.length === 0) return 'None'
    const displayItems = items.slice(0, maxItems)
    const remaining = items.length - maxItems
    const text = displayItems.join(', ')
    return remaining > 0 ? `${text} +${remaining} more` : text
  }

  return {
    getStatusBadgeClass,
    getStatusText,
    getJobTypeBadgeClass,
    getJobTypeText,
    getDepartmentBadgeClass,
    getRemoteBadgeClass,
    getRemoteText,
    formatDate,
    formatRelativeDate,
    truncateText,
    formatSalaryRange,
    getInitials,
    stripHtml,
    daysSincePosted,
    formatArrayItems
  }
}
