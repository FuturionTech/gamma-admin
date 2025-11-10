# Services Domain - Pattern Documentation

This document explains the architecture and patterns used in the Services domain, which can be replicated for other domains (Solutions, Partners, etc.).

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Type System](#type-system)
3. [GraphQL Layer](#graphql-layer)
4. [State Management](#state-management)
5. [Composables](#composables)
6. [Components](#components)
7. [Pages](#pages)
8. [Module Registration](#module-registration)
9. [Navigation Integration](#navigation-integration)
10. [Replication Checklist](#replication-checklist)

---

## Folder Structure

```
domains/services/
├── types/
│   └── index.ts              # TypeScript interfaces & types
├── stores/
│   └── useServicesStore.ts   # Pinia store for state management
├── graphql/
│   ├── queries.ts            # GraphQL queries
│   └── mutations.ts          # GraphQL mutations
├── composables/
│   ├── useServiceFormatters.ts   # Formatting utilities
│   └── useServiceActions.ts      # Reusable actions (delete, export, etc.)
├── components/
│   ├── ServiceCard.vue               # Display card
│   ├── ServiceCardSkeleton.vue       # Loading skeleton
│   ├── ServiceFormBasicInfo.vue      # Form section
│   └── ServiceFormSettings.vue       # Form section
├── pages/
│   ├── ServicesList.vue      # List view with table
│   ├── ServicesCreate.vue    # Create form
│   └── ServicesEdit.vue      # Edit form
├── index.ts                  # Nuxt module registration
└── README.md                 # This file
```

---

## Type System

### Core Types (`types/index.ts`)

```typescript
// Main entity interface
export interface Service {
  id: string
  application_id: string
  title: string
  description?: string | null
  icon?: string | null
  category?: string | null
  slug: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
  application?: Application
}

// Input types for mutations
export interface CreateServiceInput {
  application_id: string
  title: string
  description?: string | null
  icon?: string | null
  category?: string | null
  slug?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface UpdateServiceInput {
  title?: string | null
  description?: string | null
  icon?: string | null
  category?: string | null
  slug?: string | null
  order?: number | null
  is_active?: boolean | null
}

// Filter input for queries
export interface ServiceFilterInput {
  search?: string | null
  is_active?: boolean | null
  category?: string | null
  application_id?: string
}

// Statistics
export interface ServiceStatistics {
  total: number
  active: number
  inactive: number
  byCategory: Record<string, number>
}

// GraphQL Response Types
export interface ServicesResponse {
  services: Service[]
}

export interface ServiceResponse {
  service: Service
}

// UI State Types
export interface ServiceFormData extends CreateServiceInput {
  iconFile?: File | null
}
```

**Pattern to follow:**
1. Main interface matching GraphQL type
2. Create/Update input types matching mutations
3. Filter input for query variables
4. Statistics interface for dashboard metrics
5. Response types for GraphQL operations
6. UI-specific types (e.g., form data with file uploads)

---

## GraphQL Layer

### Queries (`graphql/queries.ts`)

```typescript
import { gql } from '@apollo/client/core'

export const GET_SERVICES = gql`
  query GetServices(
    $application_id: ID!
    $is_active: Boolean
    $limit: Int
  ) {
    services(
      application_id: $application_id
      is_active: $is_active
      limit: $limit
    ) {
      id
      # all fields...
    }
  }
`

export const GET_SERVICE = gql`
  query GetService($id: ID!) {
    service(id: $id) {
      id
      # all fields...
    }
  }
`
```

### Mutations (`graphql/mutations.ts`)

```typescript
export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      id
      # all fields...
    }
  }
`

export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      # all fields...
    }
  }
`

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      id
      success
      message
    }
  }
`
```

**Pattern to follow:**
1. Keep queries and mutations in separate files
2. Request all fields needed for the UI
3. Use proper input type names matching GraphQL schema
4. Include nested relations where needed

---

## State Management

### Pinia Store Pattern (`stores/useServicesStore.ts`)

**State:**
```typescript
interface ServicesState {
  services: Service[]
  currentService: Service | null
  loading: boolean
  error: string | null
  filters: ServiceFilterInput
  statistics: ServiceStatistics
}
```

**Getters:**
- `getServiceById(id)` - Find by ID
- `hasServices` - Boolean check
- `isLoading` / `hasError` - Loading states
- `filteredServices` - Client-side filtering
- `activeServices` / `inactiveServices` - Filtered lists
- `servicesByCategory` - Grouped data
- `categories` - Unique categories list

**Actions:**
- **State Mutations:** `setLoading`, `setError`, `setServices`, etc.
- **API Actions:** `fetchServices`, `fetchService`, `createService`, `updateService`, `deleteService`
- **Bulk Operations:** `bulkDelete`, `toggleServiceStatus`
- **Filter Actions:** `applySearchFilter`, `applyStatusFilter`, etc.
- **Utility:** `debouncedSearch`, `initialize`

**Pattern to follow:**
1. Keep state minimal and flat
2. Use getters for computed values
3. Separate state mutations from API calls
4. Handle errors gracefully with try-catch
5. Provide empty fallback on error
6. Use debouncing for search
7. Update local state optimistically where appropriate

---

## Composables

### Formatters (`composables/useServiceFormatters.ts`)

**Purpose:** Format data for display

**Functions:**
- `formatDate(dateString, format)` - Format dates with dayjs
- `formatRelativeDate(dateString)` - "2 hours ago"
- `getStatusBadgeClass(isActive)` - CSS class for status badge
- `getStatusText(isActive)` - Localized status text
- `getCategoryBadgeClass(category)` - CSS class for category
- `truncate(text, length)` - Truncate long text
- `generateSlug(title)` - Create URL-friendly slug
- `getIconDisplay(service)` - Icon URL with fallback

**Pattern to follow:**
- Pure functions (no side effects)
- Return consistent types
- Handle null/undefined gracefully
- Use i18n for text
- Support both French and English locale

### Actions (`composables/useServiceActions.ts`)

**Purpose:** Reusable user actions with confirmations

**Functions:**
- `confirmAndDeleteService(service)` - Delete with confirmation
- `toggleServiceStatus(service)` - Activate/deactivate
- `bulkDeleteServices(ids)` - Delete multiple
- `exportServicesToCSV()` - Export data
- `duplicateService(service)` - Clone entity

**Pattern to follow:**
- Always confirm destructive actions
- Show success/error notifications
- Return boolean for success/failure
- Use i18n for all messages
- Handle errors with try-catch

---

## Components

### Display Components

**ServiceCard.vue:**
- Props: `service: Service`
- Emits: `deleted`
- Shows: Icon, category badge, title, description, status, order
- Actions: Edit button, delete button

**ServiceCardSkeleton.vue:**
- Mimics ServiceCard structure
- Pure CSS shimmer animation
- No props or logic needed

### Form Components

**ServiceFormBasicInfo.vue:**
- Props: `modelValue: ServiceFormData`, `errors: Record<string, string>`
- Emits: `update:modelValue`
- Fields: Title, description, category, slug
- Auto-generates slug on title blur

**ServiceFormSettings.vue:**
- Props: `modelValue: ServiceFormData`, `errors`, `iconPreview: string`
- Emits: `update:modelValue`, `iconChanged: File`, `iconRemoved`
- Fields: Icon upload, order, is_active toggle

**Pattern to follow:**
1. Use v-model pattern for two-way binding
2. Emit granular events for file handling
3. Use shared UI components (InputText, InputSwitch, etc.)
4. Show validation errors inline
5. Provide helpful hints/descriptions
6. Support both URL input and file upload for images

---

## Pages

### List Page (`ServicesList.vue`)

**Features:**
- Statistics cards at top (shimmer while loading)
- Search bar with debounced search
- Status filter dropdown
- Category filter dropdown
- Export to CSV button
- Create new button
- Table with:
  - Bulk select checkboxes
  - Icon column
  - Title & description
  - Category badges
  - Status badges
  - Order number
  - Action dropdown menu
- Shimmer skeleton during loading
- Empty state with call-to-action
- Error state display

**Pattern to follow:**
1. Initialize store on mount
2. Set breadcrumbs
3. Use filteredServices getter
4. Handle bulk selection state locally
5. Use shimmer components for loading
6. Show meaningful empty and error states

### Create Page (`ServicesCreate.vue`)

**Features:**
- Tabbed form (Basic Info, Settings)
- Real-time validation
- Icon upload with preview
- Auto-slug generation
- Loading state during submission
- Cancel/Save buttons
- Redirect to list on success

**Pattern to follow:**
1. Initialize form with defaults
2. Validate on submit
3. Show inline errors
4. Handle file uploads separately
5. Use store action for creation
6. Show notifications
7. Navigate on success

### Edit Page (`ServicesEdit.vue`)

**Features:**
- Load existing data
- Pre-populate form
- Same form structure as create
- Delete button in header
- Update instead of create

**Pattern to follow:**
1. Fetch entity on mount
2. Populate form with existing data
3. Watch for changes to currentService
4. Handle delete with confirmation
5. Redirect after delete or update

---

## Module Registration

### Domain Module (`index.ts`)

```typescript
import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'services',
    configKey: 'services'
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Register components
    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: resolver.resolve('./components'),
        prefix: '',
        pathPrefix: false
      })
    })

    // Register auto-imports
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(
        resolver.resolve('./composables'),
        resolver.resolve('./stores')
      )
    })

    // Register pages as routes
    nuxt.hook('pages:extend', (pages) => {
      pages.push(
        {
          name: 'services',
          path: '/services',
          file: resolver.resolve('./pages/ServicesList.vue'),
          meta: { requiresAuth: true }
        },
        {
          name: 'services-create',
          path: '/services/create',
          file: resolver.resolve('./pages/ServicesCreate.vue'),
          meta: { requiresAuth: true }
        },
        {
          name: 'services-edit',
          path: '/services/:id/edit',
          file: resolver.resolve('./pages/ServicesEdit.vue'),
          meta: { requiresAuth: true }
        }
      )
    })
  }
})
```

**Then add to `nuxt.config.ts`:**
```typescript
modules: [
  // ...
  '~/domains/services/index.ts',
]
```

---

## Navigation Integration

Add to `/assets/data/menu-config.json`:

```json
{
  "title": {
    "fr": "Gestion de Contenu",
    "en": "Content Management"
  },
  "key": "content_management_section",
  "priority": 3,
  "routes": [
    {
      "key": "services",
      "title": {
        "fr": "Services",
        "en": "Services"
      },
      "icon": "fas fa-concierge-bell fs-2",
      "children": [
        {
          "key": "services_list",
          "title": {
            "fr": "Tous les Services",
            "en": "All Services"
          },
          "path": "/services",
          "icon": "fas fa-list fs-2"
        },
        {
          "key": "services_create",
          "title": {
            "fr": "Créer un Service",
            "en": "Create Service"
          },
          "path": "/services/create",
          "icon": "fas fa-plus fs-2"
        }
      ]
    }
  ]
}
```

---

## Replication Checklist

To create a new domain (e.g., Solutions, Partners), follow these steps:

### 1. Create Folder Structure
```bash
mkdir -p domains/{domain-name}/{types,stores,graphql,composables,components,pages}
```

### 2. Define Types (`types/index.ts`)
- [ ] Main entity interface
- [ ] CreateInput & UpdateInput types
- [ ] FilterInput type
- [ ] Statistics interface
- [ ] Response types
- [ ] FormData type (if needed)

### 3. Create GraphQL (`graphql/`)
- [ ] `queries.ts` with GET_ALL and GET_ONE
- [ ] `mutations.ts` with CREATE, UPDATE, DELETE

### 4. Implement Store (`stores/use{Domain}Store.ts`)
- [ ] State interface with: items, currentItem, loading, error, filters, statistics
- [ ] Getters: getById, hasItems, isLoading, hasError, filtered, active/inactive, byCategory, categories
- [ ] Actions: set* mutations, fetch*, create*, update*, delete*, toggle*, bulk*, apply*Filter, debounced*, initialize

### 5. Create Composables (`composables/`)
- [ ] `use{Domain}Formatters.ts` with formatting functions
- [ ] `use{Domain}Actions.ts` with confirmAndDelete, toggleStatus, bulkDelete, export, etc.

### 6. Build Components (`components/`)
- [ ] `{Domain}Card.vue` - Display card
- [ ] `{Domain}CardSkeleton.vue` - Loading skeleton
- [ ] `{Domain}FormBasicInfo.vue` - First form tab
- [ ] `{Domain}FormSettings.vue` - Second form tab (or more as needed)

### 7. Create Pages (`pages/`)
- [ ] `{Domain}List.vue` with statistics, search, filters, table, bulk actions
- [ ] `{Domain}Create.vue` with tabbed form, validation, file upload
- [ ] `{Domain}Edit.vue` with pre-population, update, delete

### 8. Register Module (`index.ts`)
- [ ] Define Nuxt module
- [ ] Register components directory
- [ ] Register auto-imports (composables, stores)
- [ ] Register routes (list, create, edit)
- [ ] Add meta (requiresAuth)

### 9. Configure Nuxt (`nuxt.config.ts`)
- [ ] Add `'~/domains/{domain-name}/index.ts'` to modules array

### 10. Update Navigation (`assets/data/menu-config.json`)
- [ ] Add menu section or item
- [ ] Set bilingual titles (fr, en)
- [ ] Choose appropriate icon
- [ ] Add child routes (list, create)
- [ ] Set correct priority

### 11. Add i18n Translations (`locales/fr.json` & `locales/en.json`)
- [ ] Add `{domain}.title`, `.subtitle`, `.createNew`, etc.
- [ ] Add `.statistics.*`
- [ ] Add `.list.*`
- [ ] Add `.form.sections.*`, `.form.labels.*`, `.form.placeholders.*`, `.form.hints.*`, `.form.validation.*`
- [ ] Add `.table.*`
- [ ] Add `.actions.*`
- [ ] Add `.messages.*`

### 12. Test
- [ ] Navigate to list page
- [ ] Create new entity
- [ ] Edit existing entity
- [ ] Delete entity
- [ ] Test filters and search
- [ ] Test bulk delete
- [ ] Test export
- [ ] Verify i18n works for both languages
- [ ] Check responsive design
- [ ] Verify loading states (shimmer)
- [ ] Verify error states

---

## Key Patterns & Best Practices

1. **Modularity:** Each domain is self-contained with all dependencies
2. **Type Safety:** Full TypeScript types for all data structures
3. **i18n:** All user-facing text via `$t()` from i18n
4. **Error Handling:** Try-catch blocks with user-friendly messages
5. **Loading States:** Shimmer skeletons (not spinners) for better UX
6. **Validation:** Client-side validation with inline error display
7. **Notifications:** Success/error toasts for user feedback
8. **Confirmations:** Always confirm destructive actions
9. **Responsive:** Bootstrap classes for mobile-friendly layouts
10. **Accessibility:** Semantic HTML, ARIA labels where needed

---

## Naming Conventions

- **Domain:** `services`, `solutions`, `partners` (lowercase, plural)
- **Store:** `useServicesStore`, `useSolutionsStore`
- **Composables:** `useServiceFormatters`, `useServiceActions`
- **Components:** `ServiceCard`, `SolutionFormBasicInfo` (PascalCase)
- **Pages:** `ServicesList`, `ServicesCreate`, `ServicesEdit`
- **Types:** `Service`, `CreateServiceInput` (PascalCase)
- **GraphQL:** `GET_SERVICES`, `CREATE_SERVICE` (UPPER_SNAKE_CASE)

---

## Questions or Issues?

Refer to this README or the Services domain implementation for clarification.
