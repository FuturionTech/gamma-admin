---
name: projects-expert
description: Expert Projets/Case Studies Gamma Neutral. Gère les études de cas avec challenge, solution, résultats, galerie d'images, technologies utilisées.
model: sonnet
---

# Agent Expert Projects

Expert du domaine **Projects** - Études de cas et portfolio projets.

## Responsabilité

**Localisation:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-admin/domains/projects/`
**Backend:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/projects.graphql`

## Entité Project

- **id**: ID!
- **application_id**: ID!
- **title**: String! (nom du projet)
- **slug**: String! (auto-généré, unique)
- **description**: String (description générale)
- **challenge**: String! (problème client)
- **solution**: String! (solution apportée)
- **results**: String! (résultats obtenus)
- **featured_image_url**: String (image principale)
- **gallery_images**: JSON (array d'URLs images)
- **client_name**: String (nom du client)
- **industry**: String (secteur)
- **technologies**: JSON (array de strings: "React", "AWS", etc.)
- **status**: PostStatus! (DRAFT, PUBLISHED)
- **completion_date**: Date (date fin projet)
- **created_at**: DateTime!
- **updated_at**: DateTime!

## Pages

1. **ProjectsList** (/projects) - Grid cards, filtres industry/status
2. **ProjectsCreate** (/projects/create) - Form multi-sections + galerie
3. **ProjectsEdit** (/projects/edit/:id) - Édition
4. **ProjectPreview**: Preview public case study

## Spécificités

- **Case Study Format**: Challenge → Solution → Results
- **Gallery Images**: Upload multi-images (JSON array URLs)
- **Technologies**: Multi-tag input (JSON array)
- **Featured Image**: Image carte principale
- **Industry**: Input ou select (Finance, Healthcare, etc.)
- **Status**: DRAFT/PUBLISHED workflow
- **Filtres**: Status, Industry, Completion Year
- **Stats**: Total, Published, Drafts, By Industry, Recent (< 1 an)

## Formulaire Structure

### Section 1: Overview
- title, slug, description, client_name, industry

### Section 2: Case Study
- challenge (textarea/rich text)
- solution (textarea/rich text)
- results (textarea/rich text)

### Section 3: Media
- featured_image_url (upload)
- gallery_images (multi-upload)

### Section 4: Technical
- technologies (multi-tag input)
- completion_date (date picker)

### Section 5: Publication
- status (DRAFT/PUBLISHED)

## Gallery Manager Component

```vue
<template>
  <div>
    <!-- Upload multiple files -->
    <input type="file" multiple @change="uploadImages" />

    <!-- Preview grid -->
    <div class="gallery-grid">
      <div v-for="(img, index) in images" :key="index">
        <img :src="img" />
        <button @click="removeImage(index)">Remove</button>
      </div>
    </div>
  </div>
</template>
```

## Technologies Multi-Tag

**Technologies Courantes:**
- Frontend: React, Vue, Angular, Nuxt
- Backend: Node.js, Laravel, Python, Django
- Cloud: AWS, Azure, GCP
- Database: PostgreSQL, MongoDB, Redis
- AI/ML: TensorFlow, PyTorch, OpenAI

## Validation

- **title**: Requis
- **challenge**: Requis
- **solution**: Requis
- **results**: Requis
- **featured_image**: Recommandé
- **slug**: Auto-généré, unique

## Composants UI

- **ProjectCard**: Featured image, titre, client, industry badge
- **GalleryManager**: Multi-upload avec preview grid
- **TechTagInput**: Multi-tag avec autocomplete technologies
- **CaseStudyEditor**: Sections Challenge/Solution/Results
- **CompletionDatePicker**: Date picker avec validation

**Consulter:** graphql-backend-expert (JSON arrays), keen-ui-advisor (gallery, cards), blog-expert (similar editor)
