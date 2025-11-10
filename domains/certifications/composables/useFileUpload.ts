import { ref } from 'vue'
import type { FilePreview } from '../types'
import { useCertificationFormatters } from './useCertificationFormatters'

export const useFileUpload = () => {
  const { isValidFileType, getFileType } = useCertificationFormatters()

  const uploadProgress = ref<number>(0)
  const isUploading = ref<boolean>(false)
  const uploadError = ref<string | null>(null)

  /**
   * Create file preview from File object
   */
  const createFilePreview = (file: File): FilePreview | null => {
    if (!isValidFileType(file)) {
      uploadError.value = 'Invalid file type. Please upload PDF or image files.'
      return null
    }

    const url = URL.createObjectURL(file)
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    const type = extension === 'pdf' ? 'pdf' : 'image'

    return {
      url,
      type,
      name: file.name
    }
  }

  /**
   * Upload file to server
   * This is a placeholder - implement actual upload logic based on your backend
   */
  const uploadFile = async (file: File): Promise<string> => {
    isUploading.value = true
    uploadProgress.value = 0
    uploadError.value = null

    try {
      // Validate file
      if (!isValidFileType(file)) {
        throw new Error('Invalid file type')
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error('File is too large. Maximum size is 10MB.')
      }

      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Upload to server
      const config = useRuntimeConfig()
      const response = await fetch(`${config.public.gqlHost}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth.token')}`
        }
      })

      // Simulate progress
      uploadProgress.value = 50

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      const data = await response.json()
      uploadProgress.value = 100

      // Return the file URL from server response
      return data.url || data.file_url || data.path

    } catch (error: any) {
      console.error('File upload error:', error)
      uploadError.value = error.message || 'Failed to upload file'
      throw error
    } finally {
      isUploading.value = false
      // Reset progress after a delay
      setTimeout(() => {
        uploadProgress.value = 0
      }, 1000)
    }
  }

  /**
   * Handle file input change
   */
  const handleFileChange = (event: Event): File | null => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) {
      return null
    }

    if (!isValidFileType(file)) {
      uploadError.value = 'Invalid file type'
      return null
    }

    uploadError.value = null
    return file
  }

  /**
   * Clear upload error
   */
  const clearUploadError = () => {
    uploadError.value = null
  }

  /**
   * Reset upload state
   */
  const resetUpload = () => {
    uploadProgress.value = 0
    isUploading.value = false
    uploadError.value = null
  }

  /**
   * Validate file before upload
   */
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!isValidFileType(file)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload PDF or image files.'
      }
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File is too large. Maximum size is 10MB.'
      }
    }

    return { valid: true }
  }

  return {
    uploadProgress,
    isUploading,
    uploadError,
    createFilePreview,
    uploadFile,
    handleFileChange,
    clearUploadError,
    resetUpload,
    validateFile
  }
}
