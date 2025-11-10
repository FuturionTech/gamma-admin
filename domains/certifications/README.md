# Certifications Domain

Complete CRUD functionality for managing certifications and awards in the Gamma Neutral admin panel.

## Overview

This domain handles all certification-related operations including:
- ISO Certifications
- Industry Awards & Recognition
- Partnership Certifications
- Quality Standards
- Compliance Certifications

## Features

- Complete CRUD operations (Create, Read, Update, Delete)
- PDF and image file upload support
- Category management
- Real-time statistics dashboard
- Advanced filtering and search
- Bulk operations
- CSV export
- File preview (PDF and images)
- Date-based filtering (recent certifications)
- Multilingual support (FR/EN)

## Structure

```
certifications/
├── components/
│   └── CertificationCard.vue       # Reusable certification card component
├── composables/
│   ├── useCertificationActions.ts  # Action handlers (delete, toggle, export)
│   ├── useCertificationFormatters.ts # Formatting utilities
│   └── useFileUpload.ts            # File upload handling
├── graphql/
│   ├── mutations.ts                # GraphQL mutations
│   └── queries.ts                  # GraphQL queries
├── pages/
│   ├── CertificationsList.vue      # List view with stats and filters
│   ├── CertificationsCreate.vue    # Create form with file upload
│   ├── CertificationsEdit.vue      # Edit form with file replacement
│   └── CertificationsView.vue      # Detail view with PDF preview
├── stores/
│   ├── useCertificationsStore.ts   # Main certifications store
│   └── useCertificationCategoriesStore.ts # Categories store
├── types/
│   └── index.ts                    # TypeScript types
├── index.ts                        # Domain module definition
└── README.md                       # This file
```

## Routes

- `/certifications` - List all certifications
- `/certifications/create` - Create new certification
- `/certifications/:id` - View certification details
- `/certifications/:id/edit` - Edit certification

## GraphQL Schema

### Certification Entity
- `id`: ID!
- `application_id`: ID!
- `title`: String! (certification title)
- `file_url`: String! (PDF or image URL)
- `certification_category_id`: ID!
- `issued_date`: Date (optional)
- `is_active`: Boolean!
- `created_at`: DateTime!
- `updated_at`: DateTime!
- `category`: CertificationCategory (relation)

### CertificationCategory Entity
- `id`: ID!
- `name`: String! (e.g., "ISO Certifications", "Awards")
- `created_at`: DateTime!
- `updated_at`: DateTime!

## File Upload

### Supported Formats
- PDF (.pdf)
- JPEG (.jpg, .jpeg)
- PNG (.png)

### Size Limit
- Maximum: 10MB per file

### Upload Endpoint
Files are uploaded to: `{GQL_HOST}/upload`

## Usage

### List Certifications

```vue
<script setup>
import { useCertificationsStore } from '~/domains/certifications/stores/useCertificationsStore'

const certificationsStore = useCertificationsStore()

onMounted(async () => {
  await certificationsStore.initialize()
})
</script>

<template>
  <div v-for="cert in certificationsStore.certifications" :key="cert.id">
    <CertificationCard :certification="cert" />
  </div>
</template>
```

### Create Certification

```typescript
const certificationsStore = useCertificationsStore()

// Upload file first
const fileUrl = await uploadFile(file)

// Create certification
await certificationsStore.createCertification({
  application_id: '1',
  title: 'ISO 9001:2015',
  file_url: fileUrl,
  certification_category_id: '1',
  issued_date: '2024-01-15',
  is_active: true
})
```

### Update Certification

```typescript
await certificationsStore.updateCertification(certificationId, {
  title: 'Updated Title',
  is_active: false
})
```

### Delete Certification

```typescript
await certificationsStore.deleteCertification(certificationId)
```

## Composables

### useCertificationFormatters

Utility functions for formatting certification data:

```typescript
const {
  formatDate,           // Format dates
  getStatusBadgeClass,  // Get badge CSS class for status
  getCategoryBadgeClass, // Get badge CSS class for category
  getFileType,          // Determine file type (pdf/image)
  isRecent,             // Check if issued < 1 year ago
  getCertificationAge   // Get age in years/months
} = useCertificationFormatters()
```

### useCertificationActions

Action handlers with user confirmations:

```typescript
const {
  confirmAndDeleteCertification,  // Delete with confirmation
  toggleCertificationStatus,      // Toggle active status
  bulkDeleteCertifications,       // Bulk delete with confirmation
  exportCertificationsToCSV,      // Export to CSV
  downloadCertificationFile       // Download file
} = useCertificationActions()
```

### useFileUpload

File upload handling:

```typescript
const {
  uploadFile,           // Upload file to server
  createFilePreview,    // Create preview from File object
  isUploading,          // Upload state
  uploadProgress,       // Progress percentage
  validateFile          // Validate file type/size
} = useFileUpload()
```

## Statistics

The list page displays the following statistics:

1. **Total Certifications**: Total count
2. **Active Certifications**: Currently active
3. **Categories**: Number of unique categories
4. **Recent**: Certifications issued in the last year

## Filters

- **Search**: Search by title or category name
- **Status**: Filter by active/inactive
- **Category**: Filter by certification category

## Internationalization

Translation keys are available in both French and English:

```json
{
  "certifications": {
    "title": "Certifications",
    "subtitle": "Manage your certifications and awards",
    "actions": {
      "create": "Create Certification",
      "edit": "Edit",
      "delete": "Delete"
    }
  }
}
```

## Dependencies

- `@apollo/client` - GraphQL client
- `pinia` - State management
- `sweetalert2` - Alerts and confirmations
- `flatpickr` - Date picker
- `dayjs` - Date formatting

## Common Category Examples

- ISO Certifications
- Awards & Recognition
- Industry Partnerships
- Compliance Certifications
- Quality Standards
- Environmental Certifications
- Security Certifications

## Best Practices

1. **Always validate files** before upload
2. **Use categories** to organize certifications
3. **Set issued_date** for accurate filtering
4. **Keep file sizes reasonable** (under 5MB recommended)
5. **Use descriptive titles** for better searchability
6. **Activate only verified** certifications
7. **Regular backups** via CSV export

## Notes

- File upload implementation requires backend endpoint at `/upload`
- Application ID is currently hardcoded to '1' - should be made configurable
- PDF preview requires browser support - fallback to download provided
- All dates are stored in 'YYYY-MM-DD' format
- Files are stored on the server and referenced by URL

## Future Enhancements

- Multi-file upload support
- Expiration date tracking
- Automatic expiration notifications
- Advanced PDF viewer with zoom/navigation
- File versioning
- Audit trail for changes
- Advanced analytics dashboard
