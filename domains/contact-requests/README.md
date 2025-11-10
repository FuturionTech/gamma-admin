# Contact Requests Domain

Expert du domaine **Contact Requests** - Gestion des demandes de contact clients.

## Responsabilité

**Localisation:** `/domains/contact-requests/`
**Backend:** `/gamma-api/graphql/entities/contact.graphql`

## Structure du Domain

```
contact-requests/
├── components/          # Composants UI spécifiques (vide pour l'instant)
├── composables/         # Logique métier réutilisable
│   ├── useContactRequestActions.ts
│   └── useContactRequestFormatters.ts
├── graphql/            # Opérations GraphQL
│   ├── queries.ts
│   └── mutations.ts
├── pages/              # Pages Vue
│   ├── ContactRequestsList.vue
│   └── ContactRequestDetail.vue
├── stores/             # State management Pinia
│   └── useContactRequestsStore.ts
├── types/              # Types TypeScript
│   └── index.ts
├── index.ts            # Module Nuxt avec routing
└── README.md           # Documentation
```

## Entité ContactRequest

```typescript
interface ContactRequest {
  id: string
  application_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  subject?: string | null
  message: string
  status: ContactRequestStatus  // NEW, IN_PROGRESS, RESOLVED
  created_at: string
  updated_at: string
  application?: Application
}
```

## Enum ContactRequestStatus

```graphql
enum ContactRequestStatus {
  NEW
  IN_PROGRESS
  RESOLVED
}
```

## Pages et Routes

1. **ContactRequestsList** (`/contact-requests`)
   - Table avec filtres par status
   - Recherche par nom, email, sujet, message
   - Filtres par date
   - Statistiques (Total, New, In Progress, Resolved, Today, This Week)
   - Bulk actions (changement status, suppression)
   - Export CSV

2. **ContactRequestDetail** (`/contact-requests/:id`)
   - Vue détaillée complète
   - Informations contact (nom, email, téléphone)
   - Sujet et message complet
   - Gestion du statut avec workflow
   - Actions rapides (répondre par email, copier email, appeler)
   - Suppression avec confirmation

## Workflow Statuts

```
NEW → IN_PROGRESS → RESOLVED
  ↓         ↓
 (Assign) (Reply & Close)
```

**Transitions autorisées:**
- NEW → IN_PROGRESS, RESOLVED
- IN_PROGRESS → RESOLVED
- RESOLVED → (aucune transition)

## Fonctionnalités

### Liste des Demandes

**Filtres:**
- Recherche texte (nom, email, sujet, message)
- Status (NEW, IN_PROGRESS, RESOLVED)
- Plage de dates

**Statistiques:**
- Total des demandes
- Nouvelles demandes
- En cours
- Résolues
- Aujourd'hui
- Cette semaine

**Actions Bulk:**
- Changement de statut multiple
- Suppression multiple

**Status Badges:**
- NEW: Badge rouge "Nouveau" avec icône exclamation
- IN_PROGRESS: Badge orange "En cours" avec icône horloge
- RESOLVED: Badge vert "Résolu" avec icône check

### Page Détail

**Affichage:**
- Informations contact complètes
- Sujet et message avec formatage préservé
- Dates de soumission et mise à jour
- Badge de statut actuel

**Gestion Statut:**
- Sélecteur de nouveau statut
- Respect du workflow de transitions
- Mise à jour avec confirmation

**Actions Rapides:**
- Répondre par email (ouvre client email)
- Copier email au clipboard
- Appeler par téléphone (si disponible)
- Supprimer avec confirmation

## Composables

### useContactRequestActions

```typescript
{
  confirmAndDeleteContactRequest,    // Suppression avec confirmation
  updateStatus,                       // Mise à jour du statut
  bulkUpdateStatus,                   // Mise à jour en masse
  bulkDeleteContactRequests,          // Suppression en masse
  exportContactRequestsToCSV,         // Export CSV
  copyEmailToClipboard               // Copie email
}
```

### useContactRequestFormatters

```typescript
{
  formatDate,              // Format DD/MM/YYYY HH:mm
  formatDateShort,         // Format DD/MM/YYYY
  formatRelativeTime,      // "il y a X jours"
  getFullName,            // Prénom + Nom
  formatPhone,            // Formatage téléphone
  truncateMessage,        // Tronque message
  getStatusBadgeClass,    // Classe CSS badge
  getStatusLabel,         // Label FR du statut
  getStatusIcon,          // Icône du statut
  isNew,                  // Test si NEW
  isInProgress,           // Test si IN_PROGRESS
  isResolved,             // Test si RESOLVED
  isToday,               // Test si aujourd'hui
  isThisWeek            // Test si cette semaine
}
```

## Store Pinia

### State

```typescript
{
  contactRequests: ContactRequest[]
  currentContactRequest: ContactRequest | null
  loading: boolean
  error: string | null
  filters: ContactRequestFilterInput
  statistics: ContactRequestStatistics
}
```

### Getters

```typescript
{
  getContactRequestById(id),
  hasContactRequests,
  isLoading,
  hasError,
  newContactRequests,
  inProgressContactRequests,
  resolvedContactRequests,
  todayContactRequests,
  thisWeekContactRequests,
  filteredContactRequests,    // Avec tous les filtres appliqués
  newCount,
  pendingCount
}
```

### Actions

```typescript
{
  fetchContactRequests(),
  fetchContactRequest(id),
  updateContactRequest(id, input),
  deleteContactRequest(id),
  updateContactRequestStatus(id, status),
  bulkUpdateStatus(ids, status),
  bulkDelete(ids),
  applySearchFilter(searchValue),
  applyStatusFilter(status),
  applyDateRangeFilter(from, to),
  debouncedSearch(searchValue),
  initialize()
}
```

## GraphQL Operations

### Queries

```graphql
query GetContactRequests($application_id: ID!, $status: ContactRequestStatus)
query GetContactRequest($id: ID!)
```

### Mutations

```graphql
mutation UpdateContactRequest($id: ID!, $input: UpdateContactRequestInput!)
mutation DeleteContactRequest($id: ID!)
```

**Note:** La mutation `createContactRequest` existe dans le backend mais n'est pas utilisée dans l'admin - elle est appelée depuis le frontend public.

## Spécificités

- **Read-Only Creation**: Les demandes sont créées uniquement depuis le frontend public
- **Admin Actions**: Consultation, changement de statut, suppression
- **Workflow Strict**: Transitions de statut contrôlées
- **Sort par défaut**: Newest first (created_at DESC)
- **Notifications**: Badge count NEW dans sidebar (optionnel)

## Validation Backend

**UpdateContactRequestInput:**
- `status`: ContactRequestStatus (optionnel)

**Authentification:**
- Mutations protégées par `@guard(with: ["sanctum"])`
- Queries accessibles (filtrage par application_id)

## Utilisation

### Initialisation dans un composant

```vue
<script setup>
import { onMounted } from 'vue'
import { useContactRequestsStore } from '~/domains/contact-requests/stores/useContactRequestsStore'

const contactRequestsStore = useContactRequestsStore()

onMounted(async () => {
  await contactRequestsStore.initialize()
})
</script>
```

### Changement de statut

```typescript
import { useContactRequestActions } from '~/domains/contact-requests/composables/useContactRequestActions'

const { updateStatus } = useContactRequestActions()

await updateStatus(contactRequestId, ContactRequestStatus.IN_PROGRESS)
```

### Export CSV

```typescript
import { useContactRequestActions } from '~/domains/contact-requests/composables/useContactRequestActions'

const { exportContactRequestsToCSV } = useContactRequestActions()

exportContactRequestsToCSV()
```

## Évolutions Futures (Optionnel)

- Notes internes sur les demandes
- Assignation à un administrateur
- Historique des changements de statut
- Templates de réponse email
- Desktop notifications pour nouvelles demandes
- Temps moyen de résolution
- Widget Dashboard avec métriques clés
- Filtres avancés (par administrateur assigné, par catégorie auto-détectée)
- Tags/Labels personnalisés

## Consulter

- **graphql-backend-expert**: Pour modifications du schéma GraphQL
- **keen-ui-advisor**: Pour composants UI (tables, badges, formulaires)
- **services-expert**: Pour intégrations (email, notifications)
