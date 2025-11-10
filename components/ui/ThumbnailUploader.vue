<template>
    <div class="card card-flush py-4">
        <!--begin::Card header-->
        <div class="card-header">
            <div class="card-title">
                <h2>{{ title }}</h2>
            </div>
        </div>
        <!--end::Card header-->
        <!--begin::Card body-->
        <div class="card-body text-center pt-0">
            <!--begin::Image input-->
            <div class="image-input image-input-empty image-input-outline image-input-placeholder mb-3"
                data-kt-image-input="true">
                <!--begin::Preview existing avatar-->
                <div class="image-input-wrapper w-150px h-150px" :style="{
                    backgroundImage: currentImageUrl ? `url('${currentImageUrl}')` : 'none',
                }"></div>
                <!--end::Preview existing avatar-->
                <!--begin::Label-->
                <label class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                    data-kt-image-input-action="change" data-bs-toggle="tooltip" :title="`Changer l'image`">
                    <i class="ki-duotone ki-pencil fs-7">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                    <!--begin::Inputs-->
                    <input type="file" :accept="acceptedExtensions.map(ext => '.' + ext).join(',')"
                        @change="onFileChange" style="display: none" />
                    <input type="hidden" name="avatar_remove" />
                    <!--end::Inputs-->
                </label>
                <!--end::Label-->
                <!--begin::Cancel-->
                <span v-if="currentImageUrl"
                    class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                    data-kt-image-input-action="cancel" data-bs-toggle="tooltip" title="Annuler l'image"
                    @click="cancel">
                    <i class="ki-duotone ki-cross fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                </span>
                <!--end::Cancel-->
                <!--begin::Remove-->
                <span v-if="currentImageUrl"
                    class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                    data-kt-image-input-action="remove" data-bs-toggle="tooltip" title="Supprimer l'image"
                    @click="remove">
                    <i class="ki-duotone ki-cross fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                </span>
                <!--end::Remove-->
            </div>
            <!--end::Image input-->
            <!--begin::Description-->
            <div class="text-muted fs-7">
                Définir l'image miniature du produit. Seuls les fichiers {{ acceptedExtensions.join(', ') }} de moins de
                {{ size }} Mo sont acceptés.
            </div>
            <!--end::Description-->
        </div>
        <!--end::Card body-->
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
    modelValue: File | null,
    title: {
        type: String,
        default: 'Thumbnail'
    },
    size: {
        type: Number,
        default: 2 // MB
    },
    extensions: {
        type: Array,
        default: () => ['jpg', 'jpeg', 'png']
    },
    imageUrl: {
        type: String,
        default: ''
    }
})

// Emits
const emit = defineEmits(['update:modelValue', 'file-selected'])

// Preview state
const previewUrl = ref(null)

// Update preview if external modelValue changes
watch(() => props.modelValue, (newFile) => {
    if (newFile instanceof File) {
        previewUrl.value = URL.createObjectURL(newFile)
    } else {
        previewUrl.value = null
    }
})

// Current image URL (preview > imageUrl)
const currentImageUrl = computed(() =>
    previewUrl.value || props.imageUrl || null
)

// Extensions list
const acceptedExtensions = computed(() =>
    props.extensions.map(ext => ext.toLowerCase())
)

// File selection
function onFileChange(event) {
    const selectedFile = event.target.files[0]
    if (!selectedFile) return

    const ext = selectedFile.name.split('.').pop().toLowerCase()
    const sizeMb = selectedFile.size / (1024 * 1024)

    if (!acceptedExtensions.value.includes(ext)) {
        alert(`Only ${acceptedExtensions.value.join(', ')} files are allowed.`)
        return
    }

    if (sizeMb > props.size) {
        alert(`File size must be under ${props.size}MB.`)
        return
    }

    previewUrl.value = URL.createObjectURL(selectedFile)
    emit('update:modelValue', selectedFile)
    emit('file-selected', selectedFile)
}

function cancel() {
    previewUrl.value = null
}

function remove() {
    previewUrl.value = null
    emit('update:modelValue', null)
    emit('file-selected', null)
}
</script>

<style scoped>
.image-input-placeholder {
    background-image: url('/assets/media/svg/files/blank-image.svg');
}

[data-bs-theme="dark"] .image-input-placeholder {
    background-image: url('/assets/media/svg/files/blank-image-dark.svg');
}
</style>