# Stats Domain

Expert du domaine **Stats** - Statistiques/métriques homepage.

## Structure

```
domains/stats/
├── types/
│   └── index.ts              # TypeScript types and interfaces
├── graphql/
│   ├── queries.ts            # GraphQL queries
│   └── mutations.ts          # GraphQL mutations
├── stores/
│   └── useStatsStore.ts      # Pinia store for state management
├── composables/
│   ├── useStatActions.ts     # Actions composable (delete, toggle, etc.)
│   └── useStatFormatters.ts  # Formatters composable (dates, icons, etc.)
├── pages/
│   ├── StatsList.vue         # List page with cards grid and table
│   ├── StatsCreate.vue       # Create page with form and preview
│   └── StatsEdit.vue         # Edit page with prepopulated form
├── components/               # (Empty - no custom components needed yet)
├── index.ts                  # Domain exports
└── README.md                 # This file
```

## Entité Stat

GraphQL Schema: `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/entities/stat.graphql`

### Fields

- **id**: ID! - Unique identifier
- **application_id**: ID! - Application reference
- **label**: String! - Display label (ex: "Clients Satisfaits")
- **value**: String! - Stat value (ex: "500", "98", "2.5")
- **unit**: String - Optional unit suffix (ex: "+", "%", "K", "M", "B")
- **icon**: String - FontAwesome icon class (ex: "fa-users", "fa-chart-line")
- **order**: Int! - Display order for homepage layout
- **is_active**: Boolean! - Active status
- **created_at**: DateTime! - Creation timestamp
- **updated_at**: DateTime! - Last update timestamp
- **application**: Application - Related application (via @belongsTo)

## Pages

### 1. StatsList (`/stats`)

List page showing all statistics with:
- **Statistics Cards**: Overview of total, active, and inactive stats
- **Search**: Filter stats by label, value, or unit
- **Status Filter**: Filter by active/inactive status
- **Data Table**: Display stats with icons, values, order controls
- **Bulk Actions**: Delete multiple stats at once
- **Export**: Export stats to CSV
- **Ordering**: Move stats up/down to change display order

### 2. StatsCreate (`/stats/create`)

Create page with:
- **Form Fields**: Label, Value, Unit, Icon, Order, Status
- **Icon Picker**: Grid of FontAwesome icons to choose from
- **Unit Selector**: Predefined options (+, %, K, M, B) or custom
- **Live Preview**: See how the stat will look on the homepage
- **Validation**: Client-side validation with error messages

### 3. StatsEdit (`/stats/edit/:id`)

Edit page with:
- **Prepopulated Form**: All fields filled with existing data
- **Same Features**: As create page
- **Metadata Display**: Created/updated timestamps
- **Live Preview**: Updated as you type

## GraphQL Operations

### Queries

**GET_STATS** - Fetch all stats for an application
```graphql
query GetStats($application_id: ID!, $is_active: Boolean) {
  stats(application_id: $application_id, is_active: $is_active) {
    id
    application_id
    label
    value
    unit
    icon
    order
    is_active
    created_at
    updated_at
    application { id, name }
  }
}
```

### Mutations

**CREATE_STAT** - Create a new stat
```graphql
mutation CreateStat($input: CreateStatInput!) {
  createStat(input: $input) { ... }
}
```

**UPDATE_STAT** - Update existing stat
```graphql
mutation UpdateStat($id: ID!, $input: UpdateStatInput!) {
  updateStat(id: $id, input: $input) { ... }
}
```

**DELETE_STAT** - Delete a stat
```graphql
mutation DeleteStat($id: ID!) {
  deleteStat(id: $id) {
    id
    success
    message
  }
}
```

## Exemples Courants

### Stat Examples

1. **Clients Satisfaits**
   - value: "500"
   - unit: "+"
   - icon: "fa-users"
   - Result: "500+ Clients Satisfaits"

2. **Taux de Satisfaction**
   - value: "98"
   - unit: "%"
   - icon: "fa-smile"
   - Result: "98% Taux de Satisfaction"

3. **Années d'Expérience**
   - value: "10"
   - unit: "+"
   - icon: "fa-calendar"
   - Result: "10+ Années d'Expérience"

4. **Projets Complétés**
   - value: "2.5"
   - unit: "M"
   - icon: "fa-check-circle"
   - Result: "2.5M Projets Complétés"

## Validation

### Label
- Required
- Max length: 255 characters

### Value
- Required
- Max length: 50 characters
- Can be numeric or text (e.g., "500", "2.5", "98")

### Unit
- Optional
- Max length: 5 characters
- Common values: "", "+", "%", "K", "M", "B"

### Icon
- Optional
- Format: FontAwesome class (fa-*)
- Default: "fa-chart-line"

### Order
- Optional (auto-assigned if not provided)
- Minimum: 1
- Used for display ordering on homepage

## Usage

### In a component

```typescript
import { useStatsStore, useStatActions, useStatFormatters } from '~/domains/stats'

const statsStore = useStatsStore()
const { confirmAndDeleteStat, toggleStatStatus } = useStatActions()
const { formatStatValue, getIconClasses } = useStatFormatters()

// Fetch stats
await statsStore.fetchStats()

// Access stats
const stats = statsStore.filteredStats
const activeStats = statsStore.activeStats

// Delete a stat
await confirmAndDeleteStat(stat)

// Toggle status
await toggleStatStatus(stat)

// Format for display
const displayValue = formatStatValue(stat) // "500+"
const iconClass = getIconClasses(stat.icon) // "fas fa-users"
```

## Features

### State Management (Pinia Store)

- **State**: stats, currentStat, loading, error, filters, statistics
- **Getters**: getStatById, hasStats, isLoading, activeStats, sortedStats, filteredStats
- **Actions**: fetchStats, fetchStat, createStat, updateStat, deleteStat, toggleStatStatus, bulkDelete, reorderStats

### Composables

**useStatActions**
- confirmAndDeleteStat - Confirm and delete with user prompt
- toggleStatStatus - Toggle active/inactive status
- bulkDeleteStats - Delete multiple stats
- exportStatsToCSV - Export stats to CSV file
- duplicateStat - Duplicate an existing stat
- moveStatUp - Move stat up in order
- moveStatDown - Move stat down in order

**useStatFormatters**
- formatDate - Format date strings
- formatStatValue - Format stat with unit (e.g., "500+")
- getStatusBadgeClass - Get CSS class for status badge
- getStatusText - Get status text (Actif/Inactif)
- formatIconClass - Format FontAwesome icon class
- getIconClasses - Get full icon HTML classes

## UI Components

### Icon Picker
Grid of FontAwesome icons with visual selection. Supports common icons:
- fa-users (Utilisateurs)
- fa-smile (Satisfaction)
- fa-chart-line (Graphique)
- fa-trophy (Trophée)
- fa-calendar (Calendrier)
- fa-check-circle (Validation)
- And more...

### Unit Dropdown
Predefined unit options:
- None (empty)
- \+ (plus)
- % (percent)
- K (thousands)
- M (millions)
- B (billions)

### Preview Card
Live preview showing:
- Selected icon
- Formatted value with unit
- Label text
- Status badge

## Notes

- **Backend API**: Uses Lighthouse GraphQL with Laravel
- **Authentication**: All mutations require Sanctum authentication (@guard)
- **Scoping**: Stats are scoped by application_id
- **Ordering**: Uses drag-and-drop style ordering (moveUp/moveDown)
- **Icons**: Uses FontAwesome 5+ icons (fas fa-*)
- **Default Application**: Currently hardcoded to application_id: "1" (should be from config)

## Related Domains

- **shared**: For breadcrumbs, notifications, common types
- **services**: Similar domain structure (good reference)
- **solutions**: Similar domain structure (good reference)
