import type { Team } from '../types'
import { useTeamStore } from '../stores/useTeamStore'
import { useTeamFormatters } from './useTeamFormatters'

export const useTeamActions = () => {
  const teamStore = useTeamStore()
  const { formatDate } = useTeamFormatters()
  const { showSuccess, showError } = useNotification()

  /**
   * Confirm and delete a team member
   */
  const confirmAndDeleteTeam = async (team: Team): Promise<boolean> => {
    const confirmMessage = `Are you sure you want to delete "${team.name}"?`
    const warningMessage = 'This action is irreversible and will permanently delete this team member.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await teamStore.deleteTeam(team.id)
      showSuccess('Team member deleted successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete team member')
      return false
    }
  }

  /**
   * Toggle team member active status
   */
  const toggleTeamStatus = async (team: Team): Promise<boolean> => {
    const action = team.is_active ? 'deactivate' : 'activate'
    const actionText = team.is_active ? 'deactivate' : 'activate'

    const confirmed = confirm(
      `Are you sure you want to ${actionText} "${team.name}"?`
    )

    if (!confirmed) {
      return false
    }

    try {
      await teamStore.toggleTeamStatus(team.id)

      const successMessage = team.is_active
        ? 'Team member deactivated successfully'
        : 'Team member activated successfully'

      showSuccess(successMessage)
      return true
    } catch (error: any) {
      showError(error.message || 'An error occurred')
      return false
    }
  }

  /**
   * Bulk delete team members
   */
  const bulkDeleteTeams = async (teamIds: string[]): Promise<boolean> => {
    if (teamIds.length === 0) {
      showError('No team members selected')
      return false
    }

    const confirmMessage = `Are you sure you want to delete ${teamIds.length} team member(s)?`
    const warningMessage = 'This action is irreversible and will permanently delete these team members.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await teamStore.bulkDelete(teamIds)
      showSuccess(`${teamIds.length} team member(s) deleted successfully`)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete team members')
      return false
    }
  }

  /**
   * Export teams to CSV
   */
  const exportTeamsToCSV = (): void => {
    const teams = teamStore.filteredTeams

    if (teams.length === 0) {
      showError('No data to export')
      return
    }

    try {
      // CSV Headers
      const headers = [
        'ID',
        'Name',
        'Role',
        'Email',
        'Contact',
        'Status',
        'Order',
        'Created At',
        'Updated At'
      ]

      // CSV Data
      const csvData = teams.map(team => [
        team.id,
        team.name,
        team.role || '',
        team.email || '',
        team.contact || '',
        team.is_active ? 'Active' : 'Inactive',
        team.order.toString(),
        formatDate(team.created_at),
        formatDate(team.updated_at)
      ])

      // Escape CSV fields that contain commas or quotes
      const escapeCSVField = (field: string): string => {
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`
        }
        return field
      }

      // Build CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map(row =>
          row.map(field => escapeCSVField(field)).join(',')
        )
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `team-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Team members exported successfully')
    } catch (error: any) {
      console.error('Error exporting CSV:', error)
      showError('Failed to export team members')
    }
  }

  /**
   * Upload profile picture
   */
  const uploadProfilePicture = async (file: File): Promise<string> => {
    try {
      // TODO: Implement actual file upload logic
      // For now, create a temporary URL
      const url = URL.createObjectURL(file)
      return url
    } catch (error: any) {
      console.error('Error uploading profile picture:', error)
      throw new Error('Failed to upload profile picture')
    }
  }

  return {
    confirmAndDeleteTeam,
    toggleTeamStatus,
    bulkDeleteTeams,
    exportTeamsToCSV,
    uploadProfilePicture
  }
}
