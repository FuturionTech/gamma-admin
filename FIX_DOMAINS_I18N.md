# Fix i18n and Padding for All Domain Pages

## Issues Fixed

### 1. i18n Translation Keys Not Resolving
**Problem**: Translation keys showing as "services.title" instead of actual text

**Solution**:
```typescript
// ❌ WRONG
const { $t } = useNuxtApp()

// ✅ CORRECT
const { t } = useI18n()
```

**In Template**:
```vue
<!-- ❌ WRONG -->
{{ $t('services.title') }}

<!-- ✅ CORRECT -->
{{ t('services.title') }}
```

### 2. Missing Page Padding
**Problem**: No padding between page content and browser edges

**Solution**:
Add container classes to root div:
```vue
<!-- ❌ WRONG -->
<template>
  <div class="domain-list">

<!-- ✅ CORRECT -->
<template>
  <div class="domain-list container-fluid p-5 p-lg-8">
```

## Files That Need Fixing

Run this command to find all domain page files:
```bash
find domains/*/pages/*.vue -type f
```

## Fix Pattern for Each File

### 1. Update Script Section
```typescript
// Add import at top
import { useI18n } from 'vue-i18n'  // Add this if missing

// Replace in script
const { t } = useI18n()  // Change from $t

// Remove this line if it exists:
// const { $t } = useNuxtApp()
```

### 2. Update Template
```bash
# Replace all $t( with t( in template
sed -i '' 's/\$t(/t(/g' path/to/file.vue
```

### 3. Add Padding to Root Div
```vue
<template>
  <div class="page-name container-fluid p-5 p-lg-8">
```

## Domains to Fix

- [x] Services - FIXED
- [ ] Solutions
- [ ] Projects
- [ ] Blog
- [ ] Team
- [ ] FAQs
- [ ] Stats
- [ ] Certifications
- [ ] Clients
- [ ] Partners
- [ ] Testimonials
- [ ] Careers
- [ ] Contact Requests
- [ ] Banners
- [ ] Dashboard

## Automated Fix Script

```bash
#!/bin/bash

# Fix i18n usage in all domain pages
for file in domains/*/pages/*.vue; do
  echo "Fixing $file..."

  # Replace $t( with t( in templates
  sed -i '' 's/\$t(/t(/g' "$file"

  # Check if file has useNuxtApp for $t
  if grep -q 'const { \$t } = useNuxtApp()' "$file"; then
    # Replace with useI18n
    sed -i '' 's/const { \$t } = useNuxtApp()/const { t } = useI18n()/' "$file"

    # Add import if not present
    if ! grep -q "import { useI18n } from 'vue-i18n'" "$file"; then
      # Add after other imports
      sed -i '' "/import { ref/a\\
import { useI18n } from 'vue-i18n'
" "$file"
    fi
  fi

  echo "✓ Fixed $file"
done

echo "All domain pages fixed!"
```

## Manual Verification

After running fixes, verify:
1. Check browser - translations should show actual text
2. Check spacing - page should have proper padding
3. Check console - no i18n errors
4. Test navigation between pages

## Bootstrap Classes Reference

- `container-fluid` - Full width container
- `p-5` - Padding level 5 (mobile)
- `p-lg-8` - Padding level 8 on large screens

## Next Steps

Once all domains are fixed:
1. Update all domain expert agents with this pattern
2. Add to documentation
3. Create linting rule to enforce proper i18n usage
