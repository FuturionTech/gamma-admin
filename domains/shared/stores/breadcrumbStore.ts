// domains/shared/stores/breadcrumbStore.ts
import { defineStore } from 'pinia';

export interface BreadcrumbItem {
    title: string;
    path?: string;
}

export const useBreadcrumbStore = defineStore('breadcrumb', {
    state: () => ({
        items: [] as BreadcrumbItem[],
    }),
    actions: {
        setBreadcrumb(items: BreadcrumbItem[]) {
            this.items = items;
        },
        clearBreadcrumb() {
            this.items = [];
        },
    },
});
