<template>
  <div class="d-flex flex-center flex-column flex-lg-row-fluid">
    <div class="w-lg-500px p-10 text-center">
      <div class="d-flex flex-center flex-column">
        <div class="symbol symbol-100px symbol-circle mb-5">
          <div class="symbol-label bg-light-primary">
            <i class="ki-outline ki-exit-right text-primary fs-2x"></i>
          </div>
        </div>

        <h1 class="text-gray-900 mb-3">Signing you out…</h1>
        <p class="text-muted fw-semibold fs-5 mb-5">
          Please wait while we end your session.
        </p>

        <div v-if="error" class="alert alert-danger">
          <i class="ki-outline ki-cross-circle fs-2 me-2"></i>
          {{ error }}
        </div>

        <div v-else class="d-flex align-items-center justify-content-center">
          <span class="spinner-border text-primary me-3"></span>
          <span>Closing your session…</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { signOut } = useAuth();
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    await signOut({ callbackUrl: '/login' });
    setTimeout(() => router.push('/login'), 1500);
  } catch {
    error.value = 'Something went wrong while signing out. Please try again.';
    setTimeout(() => router.push('/login'), 3000);
  }
});
</script>

<style scoped>
.symbol {
  margin: 0 auto 1.5rem;
}

.alert {
  max-width: 400px;
  margin: 0 auto 1.5rem;
  text-align: left;
  display: flex;
  align-items: center;
}

.spinner-border {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 0.2em;
}
</style>
