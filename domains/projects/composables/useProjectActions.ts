import type { Project } from '../types'
import { useProjectsStore } from '../stores/useProjectsStore'
import { useProjectFormatters } from './useProjectFormatters'

export const useProjectActions = () => {
  const projectsStore = useProjectsStore()
  const { formatDate } = useProjectFormatters()
  const { showSuccess, showError } = useNotification()

  /**
   * Confirm and delete a project
   */
  const confirmAndDeleteProject = async (project: Project): Promise<boolean> => {
    const confirmMessage = `Are you sure you want to delete the project "${project.title}"?`
    const warningMessage = This action is irreversible and will permanently delete this project.

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await projectsStore.deleteProject(project.id)
      showSuccess(Project deleted successfully)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete project')
      return false
    }
  }

  /**
   * Toggle project status (DRAFT/PUBLISHED)
   */
  const toggleProjectStatus = async (project: Project): Promise<boolean> => {
    const newStatus = project.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    const action = newStatus === 'PUBLISHED' ? 'publish' : 'unpublish'

    const confirmed = confirm(
      `Are you sure you want to ${action} the project "${project.title}"?`
    )

    if (!confirmed) {
      return false
    }

    try {
      await projectsStore.updateProject(project.id, { status: newStatus })

      const successMessage = newStatus === 'PUBLISHED'
        ? Project published successfully
        : Project set to draft successfully

      showSuccess(successMessage)
      return true
    } catch (error: any) {
      showError(error.message || 'An error occurred')
      return false
    }
  }

  /**
   * Bulk delete projects
   */
  const bulkDeleteProjects = async (projectIds: string[]): Promise<boolean> => {
    if (projectIds.length === 0) {
      showError('No projects selected')
      return false
    }

    const confirmMessage = `Are you sure you want to delete ${projectIds.length} project(s)?`
    const warningMessage = 'This action is irreversible and will permanently delete this project.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await projectsStore.bulkDelete(projectIds)
      showSuccess(`${projectIds.length} projet(s) supprimé(s) avec succès`)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete project')
      return false
    }
  }

  /**
   * Export projects to CSV
   */
  const exportProjectsToCSV = (): void => {
    const projects = projectsStore.filteredProjects

    if (projects.length === 0) {
      showError('No data to export')
      return
    }

    try {
      // CSV Headers
      const headers = [
        'ID',
        'Title',
        'Client',
        'Industry',
        'Status',
        'Technologies',
        'Completion Date',
        'Created',
        'Updated'
      ]

      // CSV Data
      const csvData = projects.map(project => [
        project.id,
        project.title,
        project.client_name || '',
        project.industry || '',
        project.status,
        (project.technologies || []).join('; '),
        project.completion_date ? formatDate(project.completion_date) : '',
        formatDate(project.created_at),
        formatDate(project.updated_at)
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
      link.setAttribute('download', `projects-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Projects exported successfully')
    } catch (error: any) {
      console.error('Error exporting CSV:', error)
      showError('Failed to export projects')
    }
  }

  /**
   * Duplicate a project
   */
  const duplicateProject = async (project: Project): Promise<boolean> => {
    try {
      const newProject = {
        title: `${project.title} (Copie)`,
        slug: `${project.slug}-copy-${Date.now()}`,
        description: project.description,
        challenge: project.challenge,
        solution: project.solution,
        results: project.results,
        featured_image_url: project.featured_image_url,
        gallery_images: project.gallery_images,
        client_name: project.client_name,
        industry: project.industry,
        technologies: project.technologies,
        status: 'DRAFT', // Start as draft
        completion_date: null
      }

      await projectsStore.createProject(newProject)
      showSuccess('Project duplicated successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to duplicate project')
      return false
    }
  }

  /**
   * Upload featured image
   */
  const uploadFeaturedImage = async (file: File): Promise<string | null> => {
    try {
      // TODO: Implement actual file upload to server
      // For now, we'll create a local preview URL
      // In production, this should upload to your storage service (S3, Cloudinary, etc.)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'projects/featured')

      // Example: const response = await $fetch('/api/upload', { method: 'POST', body: formData })
      // return response.url

      // Temporary: create object URL for preview
      return URL.createObjectURL(file)
    } catch (error: any) {
      console.error('Error uploading image:', error)
      showError('Failed to upload image')
      return null
    }
  }

  /**
   * Upload gallery images
   */
  const uploadGalleryImages = async (files: File[]): Promise<string[]> => {
    try {
      const uploadPromises = files.map(async (file) => {
        // TODO: Implement actual file upload to server
        // For now, we'll create local preview URLs

        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'projects/gallery')

        // Example: const response = await $fetch('/api/upload', { method: 'POST', body: formData })
        // return response.url

        // Temporary: create object URL for preview
        return URL.createObjectURL(file)
      })

      return await Promise.all(uploadPromises)
    } catch (error: any) {
      console.error('Error uploading gallery images:', error)
      showError('Failed to upload images')
      return []
    }
  }

  return {
    confirmAndDeleteProject,
    toggleProjectStatus,
    bulkDeleteProjects,
    exportProjectsToCSV,
    duplicateProject,
    uploadFeaturedImage,
    uploadGalleryImages
  }
}
