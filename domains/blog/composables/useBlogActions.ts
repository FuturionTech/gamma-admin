import type { BlogPost } from '../types'
import { useBlogStore } from '../stores/useBlogStore'
import { useBlogFormatters } from './useBlogFormatters'

export const useBlogActions = () => {
  const blogStore = useBlogStore()
  const { formatDate } = useBlogFormatters()
  const { t } = useI18n()
  const { showSuccess, showError } = useNotification()

  /**
   * Confirm and delete a blog post
   */
  const confirmAndDeletePost = async (post: BlogPost): Promise<boolean> => {
    const confirmMessage = t('blog.messages.deleteConfirm', { title: post.title })
    const warningMessage = t('blog.messages.deleteWarning')

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await blogStore.deletePost(post.id)
      showSuccess(t('blog.messages.deleteSuccess'))
      return true
    } catch (error: any) {
      showError(error.message || t('blog.messages.deleteFailed'))
      return false
    }
  }

  /**
   * Toggle blog post status (DRAFT <-> PUBLISHED)
   */
  const togglePostStatus = async (post: BlogPost): Promise<boolean> => {
    const action = post.status === 'published' ? 'draft' : 'published'
    const actionText = post.status === 'published' ? 'passer en brouillon' : 'publier'

    const confirmed = confirm(
      `Êtes-vous sûr de vouloir ${actionText} l'article "${post.title}" ?`
    )

    if (!confirmed) {
      return false
    }

    try {
      await blogStore.togglePostStatus(post.id)

      const successMessage = post.status === 'published'
        ? 'Article passé en brouillon'
        : 'Article publié avec succès'

      showSuccess(successMessage)
      return true
    } catch (error: any) {
      showError(error.message || t('common.messages.error'))
      return false
    }
  }

  /**
   * Bulk delete blog posts
   */
  const bulkDeletePosts = async (postIds: string[]): Promise<boolean> => {
    if (postIds.length === 0) {
      showError('Aucun article sélectionné')
      return false
    }

    const confirmMessage = `Êtes-vous sûr de vouloir supprimer ${postIds.length} article(s) ?`
    const warningMessage = t('blog.messages.deleteWarning')

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await blogStore.bulkDelete(postIds)
      showSuccess(`${postIds.length} article(s) supprimé(s) avec succès`)
      return true
    } catch (error: any) {
      showError(error.message || t('blog.messages.deleteFailed'))
      return false
    }
  }

  /**
   * Export blog posts to CSV
   */
  const exportPostsToCSV = (): void => {
    const posts = blogStore.filteredPosts

    if (posts.length === 0) {
      showError('Aucune donnée à exporter')
      return
    }

    try {
      // CSV Headers
      const headers = [
        'ID',
        'Titre',
        'Slug',
        'Catégorie',
        'Auteur',
        'Statut',
        'Vues',
        'Publié le',
        'Créé le'
      ]

      // CSV Data
      const csvData = posts.map(post => [
        post.id,
        post.title,
        post.slug,
        post.category || '',
        post.author ? `${post.author.first_name} ${post.author.last_name}` : '',
        post.status === 'published' ? 'Publié' : 'Brouillon',
        post.view_count.toString(),
        post.published_at ? formatDate(post.published_at) : '',
        formatDate(post.created_at)
      ])

      // Escape CSV fields
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
      link.setAttribute('download', `blog-posts-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Export réussi')
    } catch (error: any) {
      console.error('Error exporting CSV:', error)
      showError('Échec de l\'exportation des articles')
    }
  }

  /**
   * Duplicate a blog post
   */
  const duplicatePost = async (post: BlogPost): Promise<boolean> => {
    try {
      const newPost = {
        application_id: post.application_id,
        title: `${post.title} (Copie)`,
        slug: `${post.slug}-copy-${Date.now()}`,
        excerpt: post.excerpt,
        content: post.content,
        featured_image_url: post.featured_image_url,
        author_id: post.author_id,
        category: post.category,
        tags: post.tags,
        status: 'draft' as const // Always start as draft
      }

      await blogStore.createPost(newPost)
      showSuccess('Article dupliqué avec succès')
      return true
    } catch (error: any) {
      showError(error.message || 'Échec de la duplication de l\'article')
      return false
    }
  }

  /**
   * Generate slug from title
   */
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
  }

  return {
    confirmAndDeletePost,
    togglePostStatus,
    bulkDeletePosts,
    exportPostsToCSV,
    duplicatePost,
    generateSlug
  }
}
