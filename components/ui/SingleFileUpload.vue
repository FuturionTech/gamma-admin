<!--
SingleFileUpload - Composant réutilisable pour l'upload d'un seul fichier

Props:
- modelValue: File | null - Le fichier sélectionné (v-model)
- label: string - Label du champ
- isRequired: boolean - Si le champ est requis
- disabled: boolean - Si le composant est désactivé
- accept: string - Types de fichiers acceptés (ex: "image/*,.pdf")
- maxSize: number - Taille maximale en MB (défaut: 10)
- uploadTitle: string - Titre affiché dans la zone d'upload
- uploadSubtitle: string - Sous-titre affiché dans la zone d'upload
- showValidationInfo: boolean - Afficher les infos de validation
- canPreview: boolean - Afficher le bouton d'aperçu

Events:
- update:modelValue - Mise à jour du fichier sélectionné
- error - Erreur de validation
- file-selected - Fichier sélectionné avec succès
- file-removed - Fichier supprimé
- preview-requested - Demande d'aperçu du fichier

Exemples d'usage:
1. Upload d'image simple:
   <SingleFileUpload
       v-model="imageFile"
       label="Image de couverture"
       accept="image/*"
       :maxSize="5"
   />

2. Upload de document avec aperçu:
   <SingleFileUpload
       v-model="documentFile"
       label="Document PDF"
       accept=".pdf"
       :maxSize="25"
       :canPreview="true"
       @preview-requested="handlePreview"
   />

3. Upload de média avec validation stricte:
   <SingleFileUpload
       v-model="mediaFile"
       label="Fichier média"
       accept="image/*,video/*,.pdf"
       :maxSize="50"
       :isRequired="true"
       @error="handleUploadError"
   />
-->
<template>
    <div class="single-file-upload">
        <label v-if="label" class="form-label" :class="{ required: isRequired }">
            {{ label }}
        </label>
        
        <!-- Zone d'upload -->
        <div 
            class="upload-zone" 
            :class="{ 
                'is-dragover': isDragOver,
                'is-disabled': disabled,
                'has-file': !!modelValue
            }"
            @click="!disabled && triggerFileInput()"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
        >
            <div class="upload-content text-center p-4">
                <!-- Icône -->
                <div class="upload-icon mb-3">
                    <i v-if="!modelValue" class="fas fa-cloud-upload-alt fs-2 text-muted"></i>
                    <i v-else class="fas fa-file-alt fs-2 text-primary"></i>
                </div>
                
                <!-- Texte principal -->
                <div class="upload-text">
                    <div class="upload-title">
                        {{ modelValue ? modelValue.name : uploadTitle }}
                    </div>
                    <div class="upload-subtitle">
                        {{ modelValue ? `Taille: ${formatFileSize(modelValue.size)}` : uploadSubtitle }}
                    </div>
                </div>
                
                <!-- Fichier sélectionné -->
                <div v-if="modelValue" class="file-info mt-3">
                    <div class="file-badge">
                        <i class="fas fa-file me-2"></i>
                        {{ getFileExtension(modelValue.name) }}
                    </div>
                </div>
            </div>
            
            <!-- Input file caché -->
            <input
                ref="fileInput"
                type="file"
                class="d-none"
                :accept="accept"
                :disabled="disabled"
                @change="handleFileSelect"
            />
        </div>
        
        <!-- Actions sur le fichier -->
        <div v-if="modelValue" class="file-actions mt-3">
            <div class="d-flex align-items-center justify-content-between">
                <div class="file-details">
                    <small class="text-muted me-3">
                        <i class="fas fa-info-circle me-1"></i>
                        {{ formatFileSize(modelValue.size) }}
                    </small>
                    <small class="text-muted">
                        <i class="fas fa-calendar me-1"></i>
                        {{ formatDate(modelValue.lastModified) }}
                    </small>
                </div>
                <div class="file-buttons">
                    <button 
                        type="button" 
                        class="btn btn-sm btn-outline-primary me-2"
                        @click="previewFile"
                        v-if="canPreview"
                    >
                        <i class="fas fa-eye me-1"></i>
                        Aperçu
                    </button>
                    <button 
                        type="button" 
                        class="btn btn-sm btn-outline-danger"
                        @click="removeFile"
                        :disabled="disabled"
                    >
                        <i class="fas fa-trash me-1"></i>
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Informations de validation -->
        <div v-if="showValidationInfo" class="validation-info mt-2">
            <small class="text-muted">
                <i class="fas fa-info-circle me-1"></i>
                Formats acceptés: {{ formatAcceptTypes(accept) }} • Taille max: {{ formatFileSize(maxSize * 1024 * 1024) }}
            </small>
        </div>
        
        <!-- Message d'erreur -->
        <div v-if="errorMessage" class="error-message mt-2">
            <small class="text-danger">
                <i class="fas fa-exclamation-triangle me-1"></i>
                {{ errorMessage }}
            </small>
        </div>
    </div>
</template>

<script setup lang="ts">
interface SingleFileUploadProps {
    modelValue?: File | null
    label?: string
    isRequired?: boolean
    disabled?: boolean
    accept?: string
    maxSize?: number // en MB
    uploadTitle?: string
    uploadSubtitle?: string
    showValidationInfo?: boolean
    canPreview?: boolean
}

interface SingleFileUploadEmits {
    (e: 'update:modelValue', file: File | null): void
    (e: 'error', error: string): void
    (e: 'file-selected', file: File): void
    (e: 'file-removed'): void
    (e: 'preview-requested', file: File): void
}

const props = withDefaults(defineProps<SingleFileUploadProps>(), {
    modelValue: null,
    label: '',
    isRequired: false,
    disabled: false,
    accept: '*/*',
    maxSize: 10, // 10MB par défaut
    uploadTitle: 'Cliquer pour sélectionner un fichier',
    uploadSubtitle: 'ou glisser-déposer ici',
    showValidationInfo: true,
    canPreview: false
})

const emit = defineEmits<SingleFileUploadEmits>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const errorMessage = ref('')

// Déclencher la sélection de fichier
const triggerFileInput = () => {
    fileInput.value?.click()
}

// Gestion du drag & drop
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
    if (files.length > 0) {
        processFile(files[0])
    }
}

// Gestion de la sélection de fichier
const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0] || null
    if (file) {
        processFile(file)
    }
    // Reset input value to allow selecting the same file again
    target.value = ''
}

// Traitement du fichier
const processFile = (file: File) => {
    errorMessage.value = ''
    
    // Validation de la taille
    if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
        errorMessage.value = `Le fichier dépasse la taille maximale de ${props.maxSize}MB`
        emit('error', errorMessage.value)
        return
    }
    
    // Validation du type
    if (props.accept !== '*/*') {
        const acceptedTypes = props.accept.split(',').map(type => type.trim())
        const fileType = file.type
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        
        const isValidType = acceptedTypes.some(type => {
            if (type.startsWith('.')) {
                return fileExtension === type
            } else if (type.includes('*')) {
                const baseType = type.split('*')[0]
                return fileType.startsWith(baseType)
            } else {
                return fileType === type
            }
        })
        
        if (!isValidType) {
            errorMessage.value = `Type de fichier non supporté. Types acceptés: ${props.accept}`
            emit('error', errorMessage.value)
            return
        }
    }
    
    // Fichier valide
    emit('update:modelValue', file)
    emit('file-selected', file)
}

// Supprimer le fichier
const removeFile = () => {
    emit('update:modelValue', null)
    emit('file-removed')
    errorMessage.value = ''
}

// Aperçu du fichier
const previewFile = () => {
    if (props.modelValue) {
        emit('preview-requested', props.modelValue)
    }
}

// Utilitaires
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('fr-FR')
}

const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE'
}

const formatAcceptTypes = (accept: string): string => {
    if (accept === '*/*') return 'Tous les types'
    return accept.split(',').map(type => {
        if (type.startsWith('.')) {
            return type.toUpperCase()
        } else if (type.includes('*')) {
            return type.replace('*', '')
        } else {
            return type
        }
    }).join(', ')
}

// Exposer les méthodes
defineExpose({
    triggerFileInput,
    removeFile,
    clearError: () => errorMessage.value = ''
})
</script>

<style scoped>
.single-file-upload {
    width: 100%;
}

.upload-zone {
    border: 2px dashed #e1e5e9;
    border-radius: 8px;
    background-color: #f8f9fa;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.upload-zone:hover {
    border-color: #007bff;
    background-color: #f0f8ff;
}

.upload-zone.is-dragover {
    border-color: #007bff;
    background-color: #e3f2fd;
    transform: scale(1.02);
}

.upload-zone.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.upload-zone.has-file {
    border-color: #28a745;
    background-color: #f8fff9;
}

.upload-content {
    min-height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.upload-icon {
    font-size: 2rem;
}

.upload-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #495057;
}

.upload-subtitle {
    color: #6c757d;
    font-size: 0.9rem;
}

.file-info {
    margin-top: 1rem;
}

.file-badge {
    background-color: #007bff;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.file-actions {
    padding: 0.75rem;
    background-color: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
}

.file-details {
    display: flex;
    align-items: center;
}

.file-buttons {
    display: flex;
    gap: 0.5rem;
}

.validation-info {
    font-size: 0.85rem;
}

.error-message {
    font-size: 0.85rem;
}

.required::after {
    content: ' *';
    color: #dc3545;
}
</style>
