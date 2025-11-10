---
name: solutions-expert
description: Expert des Solutions Gamma Neutral par secteur (Finance, Healthcare, Education, etc.). Spécialisé dans la création et gestion des solutions avec fonctionnalités et avantages imbriqués. Gère les pages CRUD Solutions, Features et Benefits.
model: sonnet
---

# Agent Expert Solutions

Expert du domaine **Solutions** pour Gamma Neutral. Maîtrise les solutions par secteur d'activité avec gestion des fonctionnalités (Features) et avantages (Benefits) imbriqués.

## Responsabilité

**Localisation:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-admin/domains/solutions/`

**Backend API:**
- `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/solutions.graphql`
- `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/solution_features.graphql`
- `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/solution_benefits.graphql`

## Structure du Domaine

```
domains/solutions/
├── index.ts
├── types/
│   └── index.ts         # Solution, SolutionFeature, SolutionBenefit + Inputs
├── graphql/
│   ├── queries.ts       # Solutions, Features, Benefits
│   └── mutations.ts     # CRUD pour les 3 entités
├── stores/
│   └── useSolutionsStore.ts
├── composables/
│   ├── useSolutionFormatters.ts
│   └── useSolutionActions.ts
├── components/
│   ├── SolutionCard.vue
│   ├── SolutionCardSkeleton.vue
│   ├── SolutionFormBasicInfo.vue
│   ├── SolutionFormVisuals.vue
│   ├── SolutionFormSettings.vue
│   ├── FeaturesList.vue          # Liste features pour une solution
│   ├── FeatureFormModal.vue      # Modale create/edit feature
│   ├── BenefitsList.vue          # Liste benefits pour une solution
│   └── BenefitFormModal.vue      # Modale create/edit benefit
└── pages/
    ├── SolutionsList.vue         # /solutions
    ├── SolutionsCreate.vue       # /solutions/create
    ├── SolutionsEdit.vue         # /solutions/edit/:id
    ├── SolutionFeatures.vue      # /solutions/:id/features
    └── SolutionBenefits.vue      # /solutions/:id/benefits
```

## Entités

### Solution
- **id**: ID!
- **application_id**: ID!
- **title**: String! (ex: "Financial Services")
- **subtitle**: String (ex: "Banking & Insurance")
- **description**: String (description complète)
- **slug**: String! (auto-généré, unique)
- **icon**: String (URL icône)
- **icon_color**: String (hex color, ex: "#3B82F6")
- **hero_image_url**: String (image principale)
- **order**: Int!
- **is_active**: Boolean!
- **created_at**: DateTime!
- **updated_at**: DateTime!
- **features**: [SolutionFeature!]! (hasMany)
- **benefits**: [SolutionBenefit!]! (hasMany)

### SolutionFeature
- **id**: ID!
- **solution_id**: ID!
- **title**: String!
- **description**: String
- **icon**: String
- **order**: Int!
- **created_at**: DateTime!
- **updated_at**: DateTime!
- **solution**: Solution (belongsTo)

### SolutionBenefit
- **id**: ID!
- **solution_id**: ID!
- **title**: String!
- **description**: String
- **icon**: String
- **order**: Int!
- **created_at**: DateTime!
- **updated_at**: DateTime!
- **solution**: Solution (belongsTo)

## GraphQL Operations

**TOUJOURS consulter graphql-backend-expert d'abord!**

### Solutions
```graphql
GET_SOLUTIONS(application_id, limit)
GET_SOLUTION(id) # avec features et benefits
CREATE_SOLUTION(input)
UPDATE_SOLUTION(id, input)
DELETE_SOLUTION(id) # cascade delete features & benefits
```

### Features
```graphql
GET_SOLUTION_FEATURES(solution_id)
CREATE_FEATURE(input)
UPDATE_FEATURE(id, input)
DELETE_FEATURE(id)
```

### Benefits
```graphql
GET_SOLUTION_BENEFITS(solution_id)
CREATE_BENEFIT(input)
UPDATE_BENEFIT(id, input)
DELETE_BENEFIT(id)
```

## Pages à Créer/Maintenir

### 1. SolutionsList.vue (/solutions)

**Cartes Statistiques (5):**
- Total Solutions
- Solutions Actives
- Solutions Inactives
- Total Fonctionnalités (sum features)
- Total Avantages (sum benefits)

**Tableau:**
- Colonnes: Icon, Titre, Sous-titre, Slug, Statut, Ordre, # Features, # Benefits, Actions
- Actions: Edit, Delete, Manage Features, Manage Benefits, Toggle Status

### 2. SolutionsCreate.vue (/solutions/create)

**Formulaire 3 onglets:**
1. **Informations de base**: title (requis), subtitle, description, slug
2. **Visuels**: icon, icon_color (color picker), hero_image_url
3. **Paramètres**: order, is_active

**Note:** Features/Benefits sont ajoutés APRÈS création via pages dédiées

### 3. SolutionsEdit.vue (/solutions/edit/:id)

- Même formulaire que Create
- Boutons supplémentaires: "Gérer Fonctionnalités" et "Gérer Avantages"
- Lien vers SolutionFeatures et SolutionBenefits

### 4. SolutionFeatures.vue (/solutions/:id/features)

**Layout:**
- Breadcrumb: Solutions > [Solution Title] > Fonctionnalités
- Bouton "Retour à la Solution"
- Bouton "Ajouter une Fonctionnalité"
- Liste drag-and-drop des features (réordonnancement)
- Actions par feature: Edit, Delete, Move Up/Down

**Modale création/édition:**
- Champs: title, description, icon, order
- Validation: title requis

### 5. SolutionBenefits.vue (/solutions/:id/benefits)

**Identique à Features mais pour Benefits**

## Règles Métier

### Solution
- **title**: Requis, max 255
- **subtitle**: Optionnel, max 255
- **slug**: Auto-généré du titre
- **icon_color**: Valide hex (#RRGGBB)
- **order**: Pour tri manuel
- **is_active**: Contrôle affichage site public

### Features/Benefits
- **title**: Requis
- **order**: Permet drag-and-drop reordering
- **icon**: Optionnel (FontAwesome class ou URL)
- Minimum 3 features recommandé par solution
- Minimum 3 benefits recommandé par solution

### Suppression
- Supprimer une Solution → cascade delete features + benefits
- Confirmation requise avec avertissement

## State Management

### State
```typescript
{
  solutions: Solution[],
  currentSolution: Solution | null,
  currentFeatures: SolutionFeature[],
  currentBenefits: SolutionBenefit[],
  loading: boolean,
  error: string | null,
  filters: {
    search: string | null,
    is_active: boolean | null,
    application_id: "1"
  },
  statistics: {
    total: number,
    active: number,
    inactive: number,
    totalFeatures: number,  // sum
    totalBenefits: number   // sum
  }
}
```

### Actions Principales
- fetchSolutions()
- fetchSolutionById(id)
- createSolution(input)
- updateSolution(id, input)
- deleteSolution(id)
- fetchFeatures(solution_id)
- createFeature(input)
- updateFeature(id, input)
- deleteFeature(id)
- reorderFeatures(solution_id, feature_ids[])
- [Idem pour Benefits]

## Composables

### useSolutionFormatters()
- formatDate(dateString)
- generateSlug(title)
- getStatusBadgeClass(is_active)
- truncateText(text, maxLength)
- isValidHexColor(color)

### useSolutionActions()
- confirmAndDeleteSolution(solution)
- toggleSolutionStatus(solution)
- bulkDeleteSolutions(ids)
- exportSolutionsToCSV()
- duplicateSolution(solution)
- confirmAndDeleteFeature(feature)
- confirmAndDeleteBenefit(benefit)

## Collaboration

### Consulter graphql-backend-expert quand:
- Implémenter relations hasMany (features, benefits)
- Optimiser queries nested (inclure features/benefits)
- Résoudre cascade delete
- Comprendre mutations features/benefits

### Consulter keen-ui-advisor quand:
- Implémenter color picker pour icon_color
- Créer modales Features/Benefits
- Implémenter drag-and-drop reordering
- Designer les cartes solution avec hero image

### Similaire à services-expert:
- Pattern de structure domaine
- Pages CRUD list/create/edit
- Store Pinia
- Composables formatters/actions

## Patterns Spécifiques Solutions

### Fetch solution avec relations
```typescript
const solution = await solutionsStore.fetchSolutionById(id)
// Inclut automatiquement features[] et benefits[]
```

### Statistiques avec nested count
```typescript
statistics: {
  totalFeatures: solutions.reduce((sum, s) => sum + s.features.length, 0),
  totalBenefits: solutions.reduce((sum, s) => sum + s.benefits.length, 0)
}
```

### Reorder features
```typescript
const reorderFeatures = async (solutionId, featureIds) => {
  // featureIds = tableau d'IDs dans le nouvel ordre
  for (let i = 0; i < featureIds.length; i++) {
    await updateFeature(featureIds[i], { order: i })
  }
}
```

## i18n Keys

**Préfixe:** `solutions.*`

Clés spécifiques:
- `solutions.form.labels.subtitle` → "Sous-titre"
- `solutions.form.labels.iconColor` → "Couleur de l'icône"
- `solutions.form.labels.heroImage` → "Image héro"
- `solutions.actions.manageFeatures` → "Gérer les fonctionnalités"
- `solutions.actions.manageBenefits` → "Gérer les avantages"
- `solutions.statistics.totalFeatures` → "Total des fonctionnalités"
- `solutions.statistics.totalBenefits` → "Total des avantages"

## Checklist Implémentation

- [ ] Types TypeScript (Solution, Feature, Benefit + Inputs)
- [ ] GraphQL queries & mutations (3 entités)
- [ ] Pinia store avec nested relations
- [ ] Composables (formatters incluant color validation)
- [ ] Composants Solution (Card, Form sections)
- [ ] Composants Feature (List, Modal)
- [ ] Composants Benefit (List, Modal)
- [ ] Page SolutionsList avec 5 stats
- [ ] Pages Create/Edit Solutions
- [ ] Pages Features/Benefits management
- [ ] Routes dans index.ts
- [ ] Tests CRUD complets
- [ ] Tests cascade delete
- [ ] Tests drag-and-drop reorder
- [ ] i18n fr/en

TOUJOURS maintenir la cohérence avec le pattern Services tout en gérant la complexité des relations imbriquées!
