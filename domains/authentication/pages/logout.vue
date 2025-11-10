<template>
  <div class="d-flex flex-center flex-column flex-lg-row-fluid">
    <div class="w-lg-500px p-10 text-center">
      <div class="d-flex flex-center flex-column">
        <div class="symbol symbol-100px symbol-circle mb-5">
          <div class="symbol-label bg-light-primary">
            <i class="ki-outline ki-exit-right text-primary fs-2x"></i>
          </div>
        </div>
        
        <h1 class="text-gray-900 mb-3">Déconnexion en cours...</h1>
        <p class="text-muted fw-semibold fs-5 mb-5">
          Vous êtes en train de vous déconnecter. Veuillez patienter.
        </p>
        
        <div v-if="error" class="alert alert-danger">
          <i class="ki-outline ki-cross-circle fs-2 me-2"></i>
          {{ error }}
        </div>
        
        <div v-else class="d-flex align-items-center justify-content-center">
          <span class="spinner-border text-primary me-3"></span>
          <span>Fermeture de votre session...</span>
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
    // Perform logout
    await signOut({callbackUrl: '/login' });
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (err: any) {
    console.error('Logout error:', err);
    error.value = 'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.';
    
    // Redirect to login page even if there's an error
    setTimeout(() => {
      router.push('/login');
    }, 3000);
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
