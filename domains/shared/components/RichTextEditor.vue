<template>
  <div class="rich-text-editor-container">
    <!-- Shimmer Placeholder -->
    <div
        v-if="isLoading"
        class="shimmer-placeholder"
        aria-busy="true"
        aria-label="Loading editor"
    >
      <!-- Optional: You can include additional content or animations here -->
    </div>

    <!-- TinyMCE Editor -->
    <Editor
        v-else
        api-key="88qp07d30hq5kiftt7exyg75hgf3hicvhnnp8rzi6h9chon2"
        v-model="localContent"
        :init="mergedInit"
        @blur="emitBlur"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Editor from '@tinymce/tinymce-vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  initOptions: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['update:modelValue', 'blur']);

const localContent = ref(props.modelValue);

// Watch for changes in localContent and emit updates to parent
watch(localContent, (newValue) => {
  emits('update:modelValue', newValue);
});

// **Add this watcher to update localContent when props.modelValue changes**
watch(
    () => props.modelValue,
    (newValue) => {
      localContent.value = newValue;
    }
);

const defaultInit = {
  apiKey: '88qp07d30hq5kiftt7exyg75hgf3hicvhnnp8rzi6h9chon2', // Replace with your actual API key
  height: 500,
  menubar: false,
  plugins: [
    'anchor',
    'autolink',
    'charmap',
    'codesample',
    'emoticons',
    'image',
    'link',
    'lists',
    'media',
    'searchreplace',
    'table',
    'visualblocks',
    'wordcount',
    // Include any premium features you have access to
  ],
  toolbar:
      'undo redo | formatselect | blocks fontfamily fontsize | bold italic backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | removeformat | help',
  language: 'fr_FR',
};

const mergedInit = computed(() => {
  return { ...defaultInit, ...props.initOptions };
});

const isLoading = ref(true);

let shimmerTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  shimmerTimer = setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});

onBeforeUnmount(() => {
  if (shimmerTimer) {
    clearTimeout(shimmerTimer);
  }
});

const emitBlur = () => {
  emits('blur');
};
</script>

<style scoped>
/* ... your styles ... */
</style>
