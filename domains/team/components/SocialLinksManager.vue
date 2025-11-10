<template>
  <div class="social-links-manager">
    <label class="form-label">Social Networks</label>

    <div class="border rounded p-5">
      <!-- Existing Links -->
      <div
        v-for="(link, index) in internalLinks"
        :key="index"
        class="d-flex gap-3 mb-3 align-items-start"
      >
        <!-- Platform Select -->
        <div class="flex-grow-1">
          <select
            v-model="link.platform_id"
            class="form-select form-select-sm"
            @change="emitUpdate"
          >
            <option value="">Select a platform</option>
            <option
              v-for="platform in platforms"
              :key="platform.id"
              :value="platform.id"
            >
              {{ platform.name }}
            </option>
          </select>
        </div>

        <!-- URL Input -->
        <div class="flex-grow-1">
          <input
            v-model="link.url"
            type="url"
            class="form-control form-control-sm"
            placeholder="https://..."
            @input="emitUpdate"
          />
        </div>

        <!-- Remove Button -->
        <button
          type="button"
          class="btn btn-sm btn-icon btn-light-danger"
          @click="removeLink(index)"
        >
          <i class="ki-duotone ki-trash fs-3">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
            <span class="path4"></span>
            <span class="path5"></span>
          </i>
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="internalLinks.length === 0"
        class="text-center text-muted py-5"
      >
        <i class="ki-duotone ki-share fs-3x mb-3">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        <div>No social links added</div>
      </div>

      <!-- Add Button -->
      <button
        type="button"
        class="btn btn-sm btn-light-primary mt-3"
        @click="addLink"
      >
        <i class="ki-duotone ki-plus fs-3"></i>
        Add Link
      </button>
    </div>

    <!-- Helper Text -->
    <div class="form-text mt-2">
      Add links to the member's social profiles (LinkedIn, Twitter, etc.)
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SocialMediaPlatform, TeamSocialLinkInput } from '../types'

interface Props {
  modelValue?: TeamSocialLinkInput[]
  platforms: SocialMediaPlatform[]
}

interface Emits {
  (e: 'update:modelValue', value: TeamSocialLinkInput[]): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
})

const emit = defineEmits<Emits>()

const internalLinks = ref<TeamSocialLinkInput[]>([...props.modelValue])

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  internalLinks.value = [...newValue]
}, { deep: true })

const addLink = () => {
  internalLinks.value.push({
    platform_id: '',
    url: ''
  })
  emitUpdate()
}

const removeLink = (index: number) => {
  internalLinks.value.splice(index, 1)
  emitUpdate()
}

const emitUpdate = () => {
  // Filter out empty links
  const validLinks = internalLinks.value.filter(
    link => link.platform_id && link.url
  )
  emit('update:modelValue', validLinks)
}
</script>
