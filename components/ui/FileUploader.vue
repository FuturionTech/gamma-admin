<template>
  <div class="file-uploader">
    <!-- Upload Area -->
    <div 
      class="upload-area"
      :class="{ 
        'is-dragover': isDragOver,
        'is-disabled': disabled,
        'has-error': hasError 
      }"
      @click="!disabled && $refs.fileInput?.click()"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div class="upload-content">
        <div class="upload-icon">
          <i class="fas fa-cloud-upload-alt"></i>
        </div>
        <div class="upload-text">
          <span class="upload-title">{{ uploadTitle }}</span>
          <span class="upload-subtitle">{{ uploadSubtitle }}</span>
        </div>
      </div>
      <input
        ref="fileInput"
        type="file"
        :multiple="isMultiple"
        :accept="accept"
        class="file-input"
        @change="handleFileSelect"
      />
    </div>

    <!-- File List -->
    <div v-if="modelValue && modelValue.length > 0" class="uploaded-files">
      <h6 class="files-title">{{ filesTitle }}</h6>
      <div class="files-list">
        <div 
          v-for="(file, index) in modelValue" 
          :key="index"
          class="file-item"
        >
          <div class="file-info">
            <span class="file-type" :class="getFileTypeClass(file)">
              {{ getFileExtension(file.name) }}
            </span>
            <span class="file-name">{{ file.name }}</span>
          </div>
          <button 
            type="button"
            class="file-remove"
            @click="removeFile(index)"
            :disabled="disabled"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="hasError" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- Validation Info -->
    <div v-if="showValidationInfo" class="validation-info">
      <small class="text-muted">
        {{ validationInfo }}
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FileUploaderProps {
  modelValue?: File[]
  size?: number // Max file size in MB
  minLength?: number
  maxLength?: number
  isMultiple?: boolean
  accept?: string
  disabled?: boolean
  uploadTitle?: string
  uploadSubtitle?: string
  filesTitle?: string
  showValidationInfo?: boolean
}

interface FileUploaderEmits {
  (e: 'update:modelValue', files: File[]): void
  (e: 'error', error: string): void
  (e: 'files-added', files: File[]): void
  (e: 'files-removed', files: File[]): void
}

const props = withDefaults(defineProps<FileUploaderProps>(), {
  modelValue: () => [],
  size: 10, // 10MB default
  minLength: 0,
  maxLength: 10,
  isMultiple: true,
  accept: '*/*',
  disabled: false,
  uploadTitle: 'Cliquer pour télécharger',
  uploadSubtitle: 'ou glisser et déposer les fichiers ici',
  filesTitle: 'Fichiers téléchargés',
  showValidationInfo: true
})

const emit = defineEmits<FileUploaderEmits>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const hasError = ref(false)
const errorMessage = ref('')

const validationInfo = computed(() => {
  const parts = []
  if (props.size) parts.push(`Max size: ${props.size}MB`)
  if (props.maxLength > 1) parts.push(`Max files: ${props.maxLength}`)
  if (props.accept !== '*/*') parts.push(`Accepted: ${props.accept}`)
  return parts.join(' • ')
})

const handleDragOver = (event: DragEvent) => {
  if (props.disabled) return
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  if (props.disabled) return
  isDragOver.value = false
  
  const files = Array.from(event.dataTransfer?.files || [])
  processFiles(files)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)
  
  // Reset input value to allow selecting the same file again
  target.value = ''
}

const processFiles = (files: File[]) => {
  hasError.value = false
  errorMessage.value = ''
  
  // Validate file count
  if (props.maxLength && files.length > props.maxLength) {
    hasError.value = true
    errorMessage.value = `Maximum ${props.maxLength} files allowed`
    emit('error', errorMessage.value)
    return
  }
  
  // Validate each file
  const validFiles: File[] = []
  
  for (const file of files) {
    // Check file size
    if (props.size && file.size > props.size * 1024 * 1024) {
      hasError.value = true
      errorMessage.value = `File "${file.name}" exceeds maximum size of ${props.size}MB`
      emit('error', errorMessage.value)
      continue
    }
    
    // Check file type if accept is specified
    if (props.accept && props.accept !== '*/*') {
      const acceptedTypes = props.accept.split(',').map(type => type.trim())
      const fileType = file.type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase()
        }
        return fileType === type || fileType.startsWith(type.replace('/*', '/'))
      })
      
      if (!isAccepted) {
        hasError.value = true
        errorMessage.value = `File "${file.name}" is not an accepted file type`
        emit('error', errorMessage.value)
        continue
      }
    }
    
    validFiles.push(file)
  }
  
  if (validFiles.length > 0) {
    const newFiles = props.isMultiple 
      ? [...(props.modelValue || []), ...validFiles]
      : validFiles
    
    emit('update:modelValue', newFiles)
    emit('files-added', validFiles)
  }
}

const removeFile = (index: number) => {
  if (props.disabled) return
  
  const newFiles = [...(props.modelValue || [])]
  const removedFiles = newFiles.splice(index, 1)
  
  emit('update:modelValue', newFiles)
  emit('files-removed', removedFiles)
}

const getFileExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toUpperCase() || ''
  return ext || 'FILE'
}

const getFileTypeClass = (file: File): string => {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  
  const typeMap: Record<string, string> = {
    'pdf': 'pdf',
    'doc': 'doc',
    'docx': 'docx',
    'xls': 'xls',
    'xlsx': 'xlsx',
    'ppt': 'ppt',
    'pptx': 'pptx',
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'svg': 'image',
    'txt': 'text',
    'zip': 'archive',
    'rar': 'archive',
    '7z': 'archive'
  }
  
  return typeMap[ext] || 'file'
}
</script>

<style scoped>
.file-uploader {
  width: 100%;
}

.upload-area {
  border: 2px dashed #e1e5e9;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
  position: relative;
}

.upload-area:hover:not(.is-disabled) {
  border-color: #3699ff;
  background: #f0f8ff;
}

.upload-area.is-dragover {
  border-color: #3699ff;
  background: #e6f3ff;
}

.upload-area.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-area.has-error {
  border-color: #f64e60;
  background: #fff5f5;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  font-size: 3rem;
  color: #3699ff;
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-title {
  font-weight: 600;
  color: #3699ff;
  font-size: 1.1rem;
}

.upload-subtitle {
  color: #6c757d;
  font-size: 0.9rem;
}

.file-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.uploaded-files {
  margin-top: 1.5rem;
}

.files-title {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.file-type {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: white;
  min-width: 40px;
  text-align: center;
}

.file-type.pdf { background: #dc3545; }
.file-type.docx { background: #0d6efd; }
.file-type.doc { background: #0d6efd; }
.file-type.xlsx { background: #198754; }
.file-type.xls { background: #198754; }
.file-type.pptx { background: #fd7e14; }
.file-type.ppt { background: #fd7e14; }
.file-type.image { background: #6f42c1; }
.file-type.text { background: #6c757d; }
.file-type.archive { background: #fd7e14; }
.file-type.file { background: #6c757d; }

.file-name {
  color: #495057;
  font-size: 0.9rem;
  word-break: break-all;
}

.file-remove {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.file-remove:hover:not(:disabled) {
  background: #dc3545;
  color: white;
}

.file-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  margin-top: 0.75rem;
  color: #dc3545;
  font-size: 0.875rem;
}

.validation-info {
  margin-top: 0.75rem;
  font-size: 0.75rem;
}
</style> 