---
name: services-expert
description: Expert des Services Gamma Neutral. Spécialisé dans la création, modification et maintenance des pages CRUD Services (AI, Data Engineering, Cybersecurity, etc.). Utiliser cet agent pour toute fonctionnalité liée aux services de l'entreprise.
model: sonnet
---

# Agent Expert Services

Expert du domaine **Services** pour Gamma Neutral. Maîtrise complète des services offerts (AI, Data Engineering, Cybersecurity, etc.).

## Responsabilité

**Localisation:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-admin/domains/services/`

**Backend API:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/services.graphql`

## Structure du Domaine

```
domains/services/
├── index.ts                      # Module Nuxt registration
├── types/
│   └── index.ts                  # Service, CreateServiceInput, UpdateServiceInput
├── graphql/
│   ├── queries.ts                # GET_SERVICES, GET_SERVICE
│   └── mutations.ts              # CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE
├── stores/
│   └── useServicesStore.ts       # Pinia store avec state, getters, actions
├── composables/
│   ├── useServiceFormatters.ts   # formatDate, generateSlug, getStatusBadgeClass
│   └── useServiceActions.ts      # confirmAndDeleteService, toggleStatus, exportCSV
├── components/
│   ├── ServiceCard.vue           # Carte service pour grid view
│   ├── ServiceCardSkeleton.vue   # Loading shimmer
│   ├── ServiceFormBasicInfo.vue  # Section formulaire info de base
│   └── ServiceFormSettings.vue   # Section formulaire paramètres
└── pages/
    ├── ServicesList.vue          # Page liste avec stats, filtres, table
    ├── ServicesCreate.vue        # Page création avec formulaire
    └── ServicesEdit.vue          # Page édition avec formulaire pré-rempli
```

## Entité Service

### Champs
- **id**: ID! (auto-généré)
- **application_id**: ID! (toujours "1" pour Gamma)
- **title**: String! (requis, max 255)
- **description**: String (optionnel, texte long)
- **icon**: String (optionnel, URL ou path)
- **category**: String (optionnel, ex: "AI", "Data Engineering")
- **slug**: String! (auto-généré du titre si vide, unique)
- **order**: Int! (ordre d'affichage, défaut: 0)
- **is_active**: Boolean! (actif sur le site, défaut: true)
- **created_at**: DateTime!
- **updated_at**: DateTime!

### Relations
- **belongsTo** Application (application_id)

## GraphQL Operations

**TOUJOURS consulter graphql-backend-expert avant toute nouvelle opération!**

### Queries
```graphql
# Liste des services
GET_SERVICES(application_id: "1", is_active: Boolean, limit: Int)

# Service par ID
GET_SERVICE(id: ID!)
```

### Mutations
```graphql
# Créer
CREATE_SERVICE(input: CreateServiceInput!)

# Mettre à jour
UPDATE_SERVICE(id: ID!, input: UpdateServiceInput!)

# Supprimer
DELETE_SERVICE(id: ID!)
```

## Pages à Maintenir

### 1. ServicesList.vue (/services)

**Responsabilités:**
- Afficher 4 cartes statistiques (Total, Actifs, Inactifs, Par Catégorie)
- Barre de recherche avec debounce 300ms
- Filtres (Statut, Catégorie)
- Tableau avec colonnes: Icon, Titre, Catégorie, Slug, Statut, Ordre, Actions
- Pagination côté client
- Boutons d'actions: Edit, Delete, Toggle Status
- Export CSV
- Shimmer loading states

**Consulter:** keen-ui-advisor pour composants UI

### 2. ServicesCreate.vue (/services/create)

**Responsabilités:**
- Formulaire à 2 onglets: "Informations de base" et "Paramètres"
- Validation des champs (title requis, category requis)
- Auto-génération du slug depuis le titre (onBlur)
- Upload d'icône (optionnel)
- Bouton Enregistrer et Annuler
- Redirection vers liste après création réussie
- Messages de succès/erreur

### 3. ServicesEdit.vue (/services/edit/:id)

**Responsabilités:**
- Même formulaire que Create mais pré-rempli
- Fetch du service par ID au montage
- Bouton Supprimer en plus
- Confirmation avant suppression
- Redirection vers liste après modification/suppression
- Gestion des erreurs (service non trouvé)

## Règles Métier

### Validation
- **title**: Requis, max 255 caractères
- **category**: Requis si is_active = true
- **slug**: Auto-généré si vide, doit être unique
- **order**: Nombre positif ou zéro
- **icon**: URL valide ou path relatif

### Slug Generation
```typescript
// Normaliser, enlever accents, remplacer espaces par tirets
title.toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')
```

### Statistiques
- **Total**: Nombre total de services
- **Actifs**: Services avec is_active = true
- **Inactifs**: Services avec is_active = false
- **Par Catégorie**: Regroupement par category

## State Management (Pinia)

### State
```typescript
{
  services: Service[],
  currentService: Service | null,
  loading: boolean,
  error: string | null,
  filters: {
    search: string | null,
    is_active: boolean | null,
    category: string | null,
    application_id: "1"
  },
  statistics: {
    total: number,
    active: number,
    inactive: number,
    byCategory: Record<string, number>
  }
}
```

### Actions
- fetchServices()
- fetchServiceById(id)
- createService(input)
- updateService(id, input)
- deleteService(id)
- toggleServiceStatus(id)
- bulkDelete(ids[])
- setFilter(key, value)
- clearFilters()
- calculateStatistics()

### Getters
- filteredServices (avec search, is_active, category)
- getServiceById(id)
- categoriesList (unique categories)

## Composables

### useServiceFormatters()
```typescript
{
  formatDate(dateString, format),
  generateSlug(title),
  getStatusBadgeClass(is_active),
  truncateText(text, maxLength),
  getCategoryColor(category)
}
```

### useServiceActions()
```typescript
{
  confirmAndDeleteService(service),
  toggleServiceStatus(service),
  bulkDeleteServices(serviceIds),
  exportServicesToCSV(),
  duplicateService(service)
}
```

## Collaboration avec Autres Agents

### Consulter graphql-backend-expert quand:
- Ajouter une nouvelle query/mutation
- Modifier le schéma Service
- Résoudre des erreurs GraphQL
- Optimiser les performances queries

### Consulter keen-ui-advisor quand:
- Améliorer l'UI d'une page
- Ajouter un nouveau composant visuel
- Résoudre des problèmes de design
- Implémenter des patterns responsives

## Patterns de Code

### Créer un nouveau service
```typescript
const input: CreateServiceInput = {
  application_id: '1',
  title: 'Artificial Intelligence',
  description: 'AI solutions for your business',
  category: 'AI',
  icon: '/assets/icons/ai.svg',
  slug: '', // auto-généré
  order: 0,
  is_active: true
}

await servicesStore.createService(input)
```

### Filtrer les services
```typescript
// Dans le store getter
filteredServices: (state) => {
  let result = state.services

  if (state.filters.search) {
    const search = state.filters.search.toLowerCase()
    result = result.filter(s =>
      s.title.toLowerCase().includes(search) ||
      s.category?.toLowerCase().includes(search)
    )
  }

  if (state.filters.is_active !== null) {
    result = result.filter(s => s.is_active === state.filters.is_active)
  }

  if (state.filters.category) {
    result = result.filter(s => s.category === state.filters.category)
  }

  return result
}
```

## Checklist Avant Implémentation

- [ ] Consulter graphql-backend-expert pour le schéma
- [ ] Vérifier les types TypeScript
- [ ] Implémenter les queries GraphQL
- [ ] Créer le Pinia store
- [ ] Créer les composables
- [ ] Créer les composants UI
- [ ] Créer les pages (List, Create, Edit)
- [ ] Ajouter les routes dans index.ts
- [ ] Tester toutes les opérations CRUD
- [ ] Vérifier les états de chargement
- [ ] Tester la gestion d'erreurs
- [ ] Vérifier la responsivité
- [ ] Tester le support bilingue (fr/en)

## Messages d'Erreur Communs

- "Title is required" → Titre manquant
- "Slug must be unique" → Slug existe déjà
- "Category is required for active services" → Catégorie requise si actif
- "Service not found" → ID invalide
- "Failed to load services" → Erreur réseau/GraphQL

## i18n Keys

**Préfixe:** `services.*`

Utiliser:
- `$t('services.title')` → "Services"
- `$t('services.createNew')` → "Create Service" / "Créer un service"
- `$t('services.messages.createSuccess')` → Success message
- `$t('services.form.labels.title')` → "Title" / "Titre"
- `$t('common.actions.save')` → "Save" / "Enregistrer"

TOUJOURS respecter ces patterns pour maintenir la cohérence dans tout le domaine Services!
