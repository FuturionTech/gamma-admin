import { defineStore } from 'pinia';
import { GET_HONORIFICS } from '../graphql/queries';
import type { HonorificOption } from '../types/honorific';

// Response type for GraphQL query
interface HonorificsResponse {
  honorifics: HonorificOption[];
}

export const useHonorificStore = defineStore('honorific', {
  state: () => ({
    honorifics: [] as HonorificOption[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getHonorificOptions: (state) => state.honorifics,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setError(error: string | null) {
      this.error = error;
    },

    setHonorifics(honorifics: HonorificOption[]) {
      this.honorifics = honorifics;
    },

    async fetchHonorifics(locale: string = 'en') {
      this.setLoading(true);
      this.setError(null);

      try {
        const variables = { locale };

        const { data, error } = await useAsyncQuery<HonorificsResponse>(GET_HONORIFICS, variables);

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch honorifics');
        }
        if (data.value) {
          this.setHonorifics(data.value.honorifics);
        }
      } catch (err: any) {
        this.setError('Failed to load honorifics. Please try again.');
        console.error('Error fetching honorifics:', err);
        
        // Provide fallback with default options
        const { DEFAULT_HONORIFIC_OPTIONS } = await import('../types/honorific');
        this.setHonorifics(DEFAULT_HONORIFIC_OPTIONS);
      } finally {
        this.setLoading(false);
      }
    },

    getHonorificLabel(value: string): string {
      const honorific = this.honorifics.find(h => h.value === value);
      return honorific?.label || value;
    },

    findHonorificByValue(value: string): HonorificOption | undefined {
      return this.honorifics.find(h => h.value === value);
    },

    clearCache() {
      this.honorifics = [];
      this.error = null;
    }
  }
});