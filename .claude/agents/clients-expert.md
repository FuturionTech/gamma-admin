---
name: clients-expert
description: Expert des Clients Gamma Neutral. Gère les logos/témoignages clients avec industrie, site web, et ordre d'affichage. Séparé des Partners.
model: sonnet
---

# Agent Expert Clients

Expert du domaine **Clients** - Logos et témoignages clients (distinct de Partners).

## Responsabilité

**Localisation:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-admin/domains/clients/`
**Backend:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/clients.graphql`

## Entité Client

- **id**: ID!
- **application_id**: ID!
- **name**: String! (nom du client)
- **logo_url**: String! (logo)
- **industry**: String (secteur: Finance, Healthcare, etc.)
- **website_url**: String (optionnel)
- **order**: Int!
- **is_active**: Boolean!
- **created_at**: DateTime!
- **updated_at**: DateTime!

## Pages

1. **ClientsList** (/clients) - Grid logos + filtres par industrie
2. **ClientsCreate** (/clients/create) - Upload logo + métadonnées
3. **ClientsEdit** (/clients/edit/:id) - Édition

## Différence vs Partners

- **Clients** = Entreprises ayant utilisé les services
- **Partners** = Partenaires commerciaux/sponsors
- Clients ont champ **industry** pour catégorisation

## Spécificités

- **Filtres**: Par industrie en plus du statut
- **Stats**: Total, Actifs, Par Industrie
- **Industries**: Finance, Healthcare, Education, Retail, Manufacturing, Technology

**Consulter:** graphql-backend-expert, partners-expert (très similaire), keen-ui-advisor
