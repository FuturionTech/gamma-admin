import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import type { ContactRequest, ContactRequestStatus } from '../types'
import { CONTACT_REQUEST_STATUS_CONFIG } from '../types'

dayjs.extend(relativeTime)
dayjs.locale('fr')

export const useContactRequestFormatters = () => {

  const formatDate = (date: string): string => {
    return dayjs(date).format('DD/MM/YYYY HH:mm')
  }

  const formatDateShort = (date: string): string => {
    return dayjs(date).format('DD/MM/YYYY')
  }

  const formatRelativeTime = (date: string): string => {
    return dayjs(date).fromNow()
  }

  const getFullName = (contactRequest: ContactRequest): string => {
    return `${contactRequest.first_name} ${contactRequest.last_name}`
  }

  const formatPhone = (phone: string | null | undefined): string => {
    if (!phone) return '-'
    // Simple phone formatting - can be enhanced
    return phone
  }

  const truncateMessage = (message: string, maxLength: number = 100): string => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  const getStatusBadgeClass = (status: ContactRequestStatus): string => {
    return CONTACT_REQUEST_STATUS_CONFIG[status].badgeClass
  }

  const getStatusLabel = (status: ContactRequestStatus): string => {
    return CONTACT_REQUEST_STATUS_CONFIG[status].label
  }

  const getStatusIcon = (status: ContactRequestStatus): string => {
    return CONTACT_REQUEST_STATUS_CONFIG[status].icon
  }

  const isNew = (contactRequest: ContactRequest): boolean => {
    return contactRequest.status === 'NEW'
  }

  const isInProgress = (contactRequest: ContactRequest): boolean => {
    return contactRequest.status === 'IN_PROGRESS'
  }

  const isResolved = (contactRequest: ContactRequest): boolean => {
    return contactRequest.status === 'RESOLVED'
  }

  const isToday = (date: string): boolean => {
    return dayjs(date).isSame(dayjs(), 'day')
  }

  const isThisWeek = (date: string): boolean => {
    return dayjs(date).isSame(dayjs(), 'week')
  }

  return {
    formatDate,
    formatDateShort,
    formatRelativeTime,
    getFullName,
    formatPhone,
    truncateMessage,
    getStatusBadgeClass,
    getStatusLabel,
    getStatusIcon,
    isNew,
    isInProgress,
    isResolved,
    isToday,
    isThisWeek
  }
}
