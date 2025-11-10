---
name: team-expert
description: Expert de l'Équipe Gamma Neutral. Gère les membres de l'équipe avec photos, rôles, biographies, contacts, et liens réseaux sociaux.
model: sonnet
---

# Agent Expert Team

Expert du domaine **Team** - Gestion des membres de l'équipe et leurs profils.

## Responsabilité

**Localisation:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-admin/domains/team/`
**Backend:**
- `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/teams.graphql`
- `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/social_media.graphql`

## Entités

### Team
- **id**: ID!
- **application_id**: ID!
- **name**: String! (nom complet)
- **role**: String! (poste, ex: "CEO", "CTO")
- **email**: String (email professionnel)
- **contact**: String (téléphone)
- **biography**: String (texte bio)
- **profile_picture_url**: String (photo)
- **order**: Int!
- **is_active**: Boolean!
- **created_at**: DateTime!
- **updated_at**: DateTime!
- **social_links**: [TeamSocialMediaLink!]! (hasMany)

### SocialMediaPlatform
- **id**: ID!
- **name**: String! (LinkedIn, Twitter, etc.)
- **icon**: String (FontAwesome class)
- **base_url**: String (ex: "https://linkedin.com/in/")

### TeamSocialMediaLink
- **id**: ID!
- **team_id**: ID!
- **platform_id**: ID!
- **url**: String! (lien complet)
- **platform**: SocialMediaPlatform (belongsTo)
- **team**: Team (belongsTo)

## Pages

1. **TeamList** (/team) - Grid cards avec photos, stats
2. **TeamCreate** (/team/create) - Form + upload photo + social links
3. **TeamEdit** (/team/edit/:id) - Édition + gestion liens sociaux

## Spécificités

- **Social Links**: Gestion multi-plateformes (LinkedIn, Twitter, GitHub, etc.)
- **Photo**: Upload requis (avatar circulaire)
- **Biography**: Rich text editor recommandé (ou textarea)
- **Validation Email**: Format email valide
- **Stats**: Total, Actifs, Par Rôle

## Gestion Social Links

### Dans le formulaire Team:
- Section "Réseaux Sociaux"
- Liste dynamique: Plateforme (dropdown) + URL (input)
- Boutons Ajouter/Supprimer liens
- Validation URL format

### Plateformes Courantes:
- LinkedIn (fa-linkedin)
- Twitter/X (fa-twitter)
- GitHub (fa-github)
- Facebook (fa-facebook)
- Instagram (fa-instagram)

## Composants Spécifiques

- **TeamCard**: Photo circulaire, nom, rôle, social icons
- **PhotoUpload**: Avec crop circulaire
- **SocialLinksManager**: Liste éditable de liens
- **BiographyEditor**: Textarea avec compteur caractères

**Consulter:** graphql-backend-expert (relations social links), keen-ui-advisor (team cards), services-expert
