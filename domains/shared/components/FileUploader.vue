<template>
  <div
      class="file-uploader"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="handleDrop"
      :class="{ 'file-uploader--dragover': dragOver }"
      role="button"
      tabindex="0"
      @click="triggerFileSelect"
      @keydown.enter.prevent="triggerFileSelect"
      @keydown.space.prevent="triggerFileSelect"
      :aria-label="dropAreaLabel"
  >
    <div class="file-uploader__content" v-if="!hasFiles">
      <slot name="label">
        <p>{{ dropAreaLabel }}</p>
      </slot>
    </div>
    <div class="file-uploader__previews" v-else>
      <div
          class="file-uploader__preview-item"
          v-for="(preview, index) in previews"
          :key="index"
      >
        <div class="file-uploader__preview-image">
          <img v-if="isImage(preview)" :src="preview.dataUrl" alt="" />
          <video
              v-else-if="isVideo(preview)"
              :src="preview.dataUrl"
              controls
              width="100"
          ></video>
          <div v-else class="file-uploader__file-icon">
            <i class="fa fa-file"></i>
          </div>
        </div>
        <div class="file-uploader__file-info">
          <input
              v-if="allowRename"
              v-model="preview.newName"
              @blur="renameFile(index)"
              class="file-uploader__file-name-input"
          />
          <p v-else class="file-uploader__file-name">{{ preview.name }}</p>
        </div>
        <button
            class="file-uploader__remove-btn"
            @click.stop="removeFile(index)"
            :aria-label="removeButtonLabel"
        >
          &times;
        </button>
      </div>
    </div>
    <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleFileChange"
        style="display: none;"
    />
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';

export default {
  name: 'FileUploader',
  props: {
    accept: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    maxFiles: {
      type: Number,
      default: Infinity,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    initialFiles: {
      type: Array,
      default: () => [],
    },
    maxFileSize: {
      type: Number,
      default: Infinity,
    },
    showFileSize: {
      type: Boolean,
      default: true,
    },
    dropAreaLabel: {
      type: String,
      default: 'Cliquer ou glisser-déposer des fichiers ici pour les télécharger',
    },
    removeButtonLabel: {
      type: String,
      default: 'Supprimer le fichier',
    },
    allowRename: {
      type: Boolean,
      default: false,
    },
    newFileName: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue', 'file-error'],
  setup(props, { emit }) {
    const files = ref([]);
    const previews = ref([]);
    const dragOver = ref(false);

    watch(
        () => props.initialFiles,
        (newVal) => {
          if (newVal && newVal.length > 0) {
            newVal.forEach((fileUrl) => {
              createPreviewFromUrl(fileUrl);
            });
          }
        },
        { immediate: true }
    );

    watch(
        () => props.modelValue,
        (newVal) => {
          files.value = [...newVal];
        },
        { immediate: true }
    );

    const hasFiles = computed(() => previews.value.length > 0);

    const acceptMIME = computed(() => {
      return props.accept
          .split(',')
          .map((type) => type.trim())
          .filter((type) => type !== '');
    });

    const triggerFileSelect = () => {
      fileInput.value.click();
    };

    const fileInput = ref(null);

    const handleFileChange = (event) => {
      const selectedFiles = Array.from(event.target.files);
      addFiles(selectedFiles);
      event.target.value = '';
    };

    const handleDrop = (event) => {
      dragOver.value = false;
      const droppedFiles = Array.from(event.dataTransfer.files);
      addFiles(droppedFiles);
    };

    const onDragOver = () => {
      dragOver.value = true;
    };

    const onDragLeave = () => {
      dragOver.value = false;
    };

    const addFiles = (newFiles) => {
      let updatedFiles = [...files.value];
      newFiles.forEach((file) => {
        if (updatedFiles.length >= props.maxFiles) return;

        if (file.size > props.maxFileSize) {
          emit('file-error', {
            file,
            error: 'La taille du fichier dépasse la limite.',
          });
          return;
        }

        if (!isFileTypeAccepted(file)) {
          emit('file-error', { file, error: 'Type de fichier non accepté.' });
          return;
        }

        let renamedFile = file;
        if (props.newFileName) {
          renamedFile = new File([file], props.newFileName, {
            type: file.type,
            lastModified: file.lastModified,
          });
        }

        updatedFiles = [...updatedFiles, renamedFile];
        createPreview(renamedFile);
      });
      files.value = updatedFiles;
      emit('update:modelValue', files.value);
    };

    const isFileTypeAccepted = (file) => {
      if (!acceptMIME.value.length) return true;
      return acceptMIME.value.some((type) => {
        if (type.startsWith('.')) {
          return file.name.endsWith(type);
        }
        if (type.endsWith('/*')) {
          const baseType = type.replace('/*', '');
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });
    };

    const createPreview = (file) => {
      const preview = {
        file: file,
        name: file.name,
        newName: file.name,
        size: file.size,
        dataUrl: null,
      };
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.dataUrl = e.target.result;
          previews.value.push(preview);
        };
        reader.readAsDataURL(file);
      } else {
        previews.value.push(preview);
      }
    };

    const createPreviewFromUrl = (url) => {
      const preview = {
        file: null,
        name: extractFileName(url),
        newName: extractFileName(url),
        dataUrl: url,
        size: null,
      };
      previews.value.push(preview);
    };

    const extractFileName = (url) => {
      return url.substring(url.lastIndexOf('/') + 1).split('?')[0];
    };

    const removeFile = (index) => {
      files.value = files.value.filter((_, i) => i !== index);
      previews.value = previews.value.filter((_, i) => i !== index);
      emit('update:modelValue', files.value);
    };

    const renameFile = (index) => {
      const preview = previews.value[index];
      if (preview.file) {
        const extension = preview.file.name.split('.').pop();
        const newName = preview.newName.includes('.')
            ? preview.newName
            : `${preview.newName}.${extension}`;
        const renamedFile = new File([preview.file], newName, {
          type: preview.file.type,
          lastModified: preview.file.lastModified,
        });
        const updatedFiles = [...files.value];
        updatedFiles.splice(index, 1, renamedFile);
        files.value = updatedFiles;
        preview.name = newName;
        preview.file = renamedFile;
        emit('update:modelValue', files.value);
      }
    };

    const isImage = (preview) => {
      if (preview.file) {
        return preview.file.type.startsWith('image/');
      } else if (preview.dataUrl) {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(preview.dataUrl);
      }
      return false;
    };

    const isVideo = (preview) => {
      if (preview.file) {
        return preview.file.type.startsWith('video/');
      } else if (preview.dataUrl) {
        return /\.(mp4|webm|ogg|mov|avi)$/i.test(preview.dataUrl);
      }
      return false;
    };

    return {
      files,
      previews,
      dragOver,
      hasFiles,
      acceptMIME,
      triggerFileSelect,
      handleFileChange,
      handleDrop,
      onDragOver,
      onDragLeave,
      addFiles,
      removeFile,
      renameFile,
      isImage,
      isVideo,
      fileInput,
    };
  },
};
</script>

<style scoped>
.file-uploader {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: border-color 0.3s;
  border-radius: 8px;
  outline: none;
}

.file-uploader:focus {
  border-color: #000;
}

.file-uploader--dragover {
  border-color: #000;
}

.file-uploader__content p {
  margin: 0;
  color: #888;
}

.file-uploader__previews {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.file-uploader__preview-item {
  position: relative;
  width: 100px;
}

.file-uploader__preview-image {
  width: 100%;
  height: 100px;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-uploader__preview-image img,
.file-uploader__preview-image video {
  max-width: 100%;
  max-height: 100%;
}

.file-uploader__file-icon {
  font-size: 40px;
  color: #888;
}

.file-uploader__file-info {
  margin-top: 5px;
  text-align: center;
}

.file-uploader__file-name {
  font-size: 12px;
  word-break: break-all;
}

.file-uploader__file-name-input {
  width: 90%;
  font-size: 12px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.file-uploader__remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
}
</style>
