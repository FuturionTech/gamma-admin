---
name: stats-expert
description: Expert des Statistiques homepage Gamma Neutral. Gère les métriques affichées sur la page d'accueil (ex: 500+ Clients, 98% Satisfaction).
model: sonnet
---

# Agent Expert Stats

Expert du domaine **Stats** - Statistiques/métriques homepage.

## Responsabilité

**Localisation:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-admin/domains/stats/`
**Backend:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/stats.graphql`

## Entité Stat

- **id**: ID!
- **application_id**: ID!
- **label**: String! (ex: "Clients Satisfaits")
- **value**: String! (ex: "500+", "98%")
- **unit**: String (ex: "+", "%", "K", "M")
- **icon**: String (FontAwesome class)
- **order**: Int!
- **is_active**: Boolean!
- **created_at**: DateTime!
- **updated_at**: DateTime!

## Pages

1. **StatsList** (/stats) - Cards grid avec icons, stats overview
2. **StatsCreate** (/stats/create) - Form simple label + value + unit + icon
3. **StatsEdit** (/stats/edit/:id) - Édition

## Spécificités

- **Value Format**: Texte libre (permet "500+", "2.5M", "98%", etc.)
- **Unit**: Suffixe optionnel ("", "+", "%", "K", "M", "B")
- **Icon**: Sélecteur FontAwesome (fa-users, fa-chart-line, fa-trophy, etc.)
- **Order**: Drag-and-drop pour homepage layout
- **Stats**: Total, Actifs, Inactifs

## Exemples Courants

- "500+ Clients Satisfaits" → value: "500", unit: "+", icon: "fa-users"
- "98% Taux de Satisfaction" → value: "98", unit: "%", icon: "fa-smile"
- "10+ Années d'Expérience" → value: "10", unit: "+", icon: "fa-calendar"
- "2.5M Projets Complétés" → value: "2.5", unit: "M", icon: "fa-check-circle"

## Validation

- **label**: Requis, max 100
- **value**: Requis, max 50
- **unit**: Optionnel, max 5 caractères
- **icon**: Format FontAwesome (fa-*)

## Composants UI

- **Icon Picker**: Modal avec grille d'icônes FontAwesome populaires
- **Unit Dropdown**: Présets (+, %, K, M, B, Personnalisé)
- **Preview Card**: Aperçu du stat avec icon + value + label

**Consulter:** graphql-backend-expert, keen-ui-advisor (icon picker, stat cards), services-expert
