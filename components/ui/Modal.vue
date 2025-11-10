<template>
    <div class="modal fade" tabindex="-1" :id="modalId" ref="modalRef" aria-hidden="true" :data-bs-backdrop="backdropStatic ? 'static' : null">
        <div class="modal-dialog" :class="[
            size ? `modal-${size}` : '',
            centered ? 'modal-dialog-centered' : '',
            scrollable ? 'modal-dialog-scrollable' : ''
        ]">
            <div class="modal-content">
                <!-- Header -->
                <div v-if="$slots.header" class="modal-header">
                    <slot name="header" />
                    <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" @click="hide" aria-label="Close">
                        <i class="ki-duotone ki-cross fs-1">
                            <span class="path1"></span><span class="path2"></span>
                        </i>
                    </div>
                </div>

                <!-- Body -->
                <div v-if="$slots.body" class="modal-body">
                    <slot name="body" />
                </div>

                <!-- Footer -->
                <div v-if="$slots.footer" class="modal-footer">
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    modalId: { type: String, required: true },
    size: { type: String, default: '' }, // 'sm', 'lg', 'xl'
    centered: { type: Boolean, default: false },
    scrollable: { type: Boolean, default: false }, // ← ajout ici
    backdropStatic: { type: Boolean, default: false } // ← Ajout ici

})

const modalRef = ref(null)
let bsModal = null

function show() {
    bsModal?.show()
}

function hide() {
    bsModal?.hide()
}

defineExpose({ show, hide })

onMounted(async () => {
    if (process.client) {
        const bootstrap = await import('bootstrap')
        bsModal = new bootstrap.Modal(modalRef.value,{
            backdrop: props.backdropStatic ? 'static' : true
        })
    }
})

onBeforeUnmount(() => {
    if (bsModal) {
        bsModal.dispose()
        bsModal = null
    }
})
</script>
