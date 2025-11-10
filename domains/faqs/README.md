# FAQs Domain - Gamma Neutral Admin

This domain handles the management of Frequently Asked Questions (FAQs) for the Gamma Neutral application.

## Overview

The FAQs domain provides CRUD functionality for managing questions and answers that are displayed on the public-facing website. FAQs can be categorized, ordered, and activated/deactivated.

## Structure

```
domains/faqs/
├── graphql/           # GraphQL operations
│   ├── queries.ts     # GET_FAQS, GET_FAQ
│   └── mutations.ts   # CREATE_FAQ, UPDATE_FAQ, DELETE_FAQ
├── types/             # TypeScript interfaces
│   └── index.ts       # FAQ types and interfaces
├── stores/            # Pinia state management
│   └── useFAQsStore.ts
├── composables/       # Reusable logic
│   ├── useFAQActions.ts     # CRUD actions with confirmations
│   └── useFAQFormatters.ts  # Formatting utilities
├── pages/             # Vue pages
│   ├── FAQsList.vue         # List/Index page
│   ├── FAQsCreate.vue       # Create new FAQ
│   └── FAQsEdit.vue         # Edit existing FAQ
├── components/        # Domain-specific components
├── index.ts           # Public exports
└── README.md          # This file
```

## Features

### Entity Fields

- `id`: Unique identifier
- `application_id`: Multi-tenant application reference
- `question`: The FAQ question (max 300 characters)
- `answer`: The FAQ answer (max 2000 characters)
- `category`: Optional category (General, Pricing, Technical, Support, Services, Security)
- `order`: Display order (for sorting)
- `is_active`: Active/Inactive status
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Pages

1. **FAQsList** (`/faqs`)
   - View all FAQs in a table format
   - Statistics cards (Total, Active, Inactive, Categories)
   - Search functionality (searches in questions and answers)
   - Filter by status (Active/Inactive)
   - Filter by category
   - Bulk delete functionality
   - Export to CSV
   - Sortable by order

2. **FAQsCreate** (`/faqs/create`)
   - Simple form with question and answer fields
   - Category selection dropdown
   - Order input for manual sorting
   - Active/Inactive toggle
   - Character counters for question (300) and answer (2000)
   - Form validation

3. **FAQsEdit** (`/faqs/:id/edit`)
   - Prepopulated form with existing FAQ data
   - Same fields as create
   - Shows metadata (created_at, updated_at)
   - Delete button
   - Only saves changed fields
   - Change detection (disables save if no changes)

### Store Actions

- `fetchFAQs()` - Fetch all FAQs with filters
- `fetchFAQ(id)` - Fetch single FAQ
- `createFAQ(input)` - Create new FAQ
- `updateFAQ(id, input)` - Update existing FAQ
- `deleteFAQ(id)` - Delete FAQ
- `toggleFAQStatus(id)` - Toggle active/inactive
- `bulkDelete(ids)` - Delete multiple FAQs
- `updateFAQOrder(id, order)` - Update display order
- `applySearchFilter(search)` - Filter by search term
- `applyStatusFilter(status)` - Filter by active status
- `applyCategoryFilter(category)` - Filter by category

### Composables

**useFAQActions**
- `confirmAndDeleteFAQ(faq)` - Delete with confirmation
- `toggleFAQStatus(faq)` - Toggle status with notification
- `bulkDeleteFAQs(ids)` - Bulk delete with confirmation
- `exportFAQsToCSV()` - Export filtered FAQs to CSV
- `updateFAQOrder(id, order)` - Update display order

**useFAQFormatters**
- `truncate(text, length)` - Truncate text
- `getStatusBadgeClass(isActive)` - Get badge class for status
- `getStatusText(isActive)` - Get status text
- `getCategoryBadgeClass(category)` - Get badge class for category
- `formatDate(date)` - Format date
- `formatDateTime(date)` - Format date and time
- `stripHtmlTags(html)` - Remove HTML tags
- `getAnswerPreview(answer, length)` - Get answer preview

## Usage

### Import in a Component

```vue
<script setup lang="ts">
import { useFAQsStore } from '~/domains/faqs/stores/useFAQsStore'
import { useFAQActions } from '~/domains/faqs/composables/useFAQActions'

const faqsStore = useFAQsStore()
const { confirmAndDeleteFAQ } = useFAQActions()

onMounted(async () => {
  await faqsStore.initialize()
})
</script>
```

### Creating a New FAQ

```typescript
const input = {
  application_id: '1',
  question: 'What is Gamma Neutral?',
  answer: 'Gamma Neutral is a comprehensive platform...',
  category: 'General',
  order: 0,
  is_active: true
}

await faqsStore.createFAQ(input)
```

### Filtering FAQs

```typescript
// By search
await faqsStore.applySearchFilter('pricing')

// By status
await faqsStore.applyStatusFilter(true) // active only

// By category
await faqsStore.applyCategoryFilter('Technical')
```

## Categories

Pre-defined categories:
- General
- Pricing
- Technical
- Support
- Services
- Security

Categories can be filtered and are displayed with color-coded badges.

## GraphQL Schema

Backend schema located at: `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/entities/faq.graphql`

### Queries

```graphql
faqs(
  application_id: ID!
  category: String
  is_active: Boolean
): [FAQ!]!
```

### Mutations

```graphql
createFAQ(input: CreateFAQInput!): FAQ!
updateFAQ(id: ID!, input: UpdateFAQInput!): FAQ!
deleteFAQ(id: ID!): DeleteResponse!
```

## Validation Rules

- **Question**: Required, max 300 characters
- **Answer**: Required, min 10 characters, max 2000 characters
- **Category**: Optional
- **Order**: Optional, must be >= 0

## Notes

- FAQs are sorted by the `order` field in ascending order
- Search is debounced (300ms) for better performance
- All actions show success/error notifications using SweetAlert2
- Bulk operations process items sequentially
- Export includes all filtered FAQs with ID, Question, Answer, Category, Order, Status, and Created At

## Future Enhancements

- Drag-and-drop reordering within categories
- Rich text editor for answers (TinyMCE integration)
- FAQ templates
- Analytics (view counts)
- Import from CSV
- Multi-language support
