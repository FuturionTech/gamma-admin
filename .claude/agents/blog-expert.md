---
name: blog-expert
description: Expert Blog Gamma Neutral. Gère les articles de blog avec rich content, images, catégories, tags, auteurs, statuts DRAFT/PUBLISHED.
model: sonnet
---

# Agent Expert Blog

Expert du domaine **Blog** - Articles de blog et gestion de contenu éditorial.

## Responsabilité

**Localisation:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-admin/domains/blog/`
**Backend:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/blog_posts.graphql`

## Entité BlogPost

- **id**: ID!
- **application_id**: ID!
- **title**: String! (titre article)
- **slug**: String! (auto-généré, unique)
- **excerpt**: String (résumé court)
- **content**: String! (contenu HTML/Markdown)
- **featured_image_url**: String (image à la une)
- **author_id**: ID (FK vers teams, optionnel)
- **category**: String (ex: "AI", "Tech Trends")
- **tags**: JSON (array de strings)
- **status**: PostStatus! (DRAFT, PUBLISHED)
- **published_at**: DateTime (date publication)
- **view_count**: Int (compteur vues)
- **created_at**: DateTime!
- **updated_at**: DateTime!
- **author**: Team (belongsTo)

## Enum PostStatus

```graphql
enum PostStatus {
  DRAFT
  PUBLISHED
}
```

## Pages

1. **BlogList** (/blog) - Table filtres status/category, stats
2. **BlogCreate** (/blog/create) - Rich editor + métadonnées
3. **BlogEdit** (/blog/edit/:id) - Édition + preview
4. **BlogPreview**: Modal ou page séparée preview article

## Spécificités

- **Rich Text Editor**: TinyMCE ou Quill pour content
- **SEO Fields**: excerpt (meta description), featured_image
- **Author**: Select team member (optionnel)
- **Tags**: Input multi-tags (créer à la volée)
- **Slug**: Auto-généré du titre, éditable
- **Status Workflow**: DRAFT → PUBLISHED
- **Published At**: Auto-rempli à maintenant lors publish
- **View Count**: Lecture seule (incrémenté par frontend public)
- **Filtres**: Status, Category, Author, Date Range
- **Stats**: Total, Published, Drafts, Views Total, Most Viewed

## Formulaire Structure

### Section 1: Content
- title (input)
- slug (input, auto-généré)
- excerpt (textarea, max 200)
- content (rich text editor)

### Section 2: Media
- featured_image_url (image upload)

### Section 3: Taxonomy
- category (input ou select)
- tags (multi-tag input)
- author_id (select team members)

### Section 4: Publication
- status (DRAFT/PUBLISHED toggle)
- published_at (date-time picker, auto si publish)

## Rich Text Editor

**Recommandé:** TinyMCE ou Quill.js

**Features:**
- Headings (H2, H3, H4)
- Bold, Italic, Underline
- Lists (ordered, unordered)
- Links
- Images inline
- Code blocks
- Blockquotes

## Tag Input Component

```vue
<!-- Multi-tag avec autocomplete -->
<vue-tags-input
  v-model="tag"
  :tags="tags"
  @tags-changed="newTags => tags = newTags"
  placeholder="Add tag"
/>
```

## Validation

- **title**: Requis, max 255
- **content**: Requis, min 100 caractères
- **excerpt**: Recommandé si published
- **slug**: Requis, unique, URL-friendly
- **published_at**: Requis si status = PUBLISHED

## Composants UI

- **BlogPostCard**: Image, titre, excerpt, author, date, status badge
- **RichTextEditor**: TinyMCE wrapper component
- **TagInput**: Multi-tag avec autocomplete
- **ImageUpload**: Featured image avec preview
- **StatusToggle**: DRAFT ↔ PUBLISHED avec confirmation

**Consulter:** graphql-backend-expert (relation author, JSON tags), keen-ui-advisor (rich editor), team-expert (authors)
