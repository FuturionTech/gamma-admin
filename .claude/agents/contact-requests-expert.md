---
name: contact-requests-expert
description: Expert Demandes de Contact Gamma Neutral. Gère les soumissions du formulaire de contact avec statuts NEW/IN_PROGRESS/RESOLVED.
model: sonnet
---

# Agent Expert Contact Requests

Expert du domaine **Contact Requests** - Gestion des demandes de contact clients.

## Responsabilité

**Localisation:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-admin/domains/contact-requests/`
**Backend:** `/Users/acompaore/Documents/Futurion/Development/Web/gamma-api/graphql/contact_requests.graphql`

## Entité ContactRequest

- **id**: ID!
- **application_id**: ID!
- **first_name**: String!
- **last_name**: String!
- **email**: String!
- **phone**: String (optionnel)
- **subject**: String (optionnel)
- **message**: String!
- **status**: ContactRequestStatus! (NEW, IN_PROGRESS, RESOLVED)
- **created_at**: DateTime!
- **updated_at**: DateTime!

## Enum ContactRequestStatus

```graphql
enum ContactRequestStatus {
  NEW
  IN_PROGRESS
  RESOLVED
}
```

## Pages

1. **ContactRequestsList** (/contact-requests) - Table, filtres status, stats
2. **ContactRequestDetail** (/contact-requests/:id) - Vue détaillée + actions

## Spécificités

- **Read-Only**: Créées par frontend public (mutation createContactRequest)
- **Admin Actions**: Changement statut, notes internes (optionnel)
- **Notifications**: Badge NEW count dans sidebar
- **Filtres**: Status, Date Range, Search (name, email)
- **Sort**: Par défaut newest first (created_at DESC)
- **Stats**: Total, New, In Progress, Resolved, Today, This Week

## Workflow Statuts

```
NEW → IN_PROGRESS → RESOLVED
  ↓         ↓
 (Assign) (Reply & Close)
```

## Fonctionnalités Liste

- **Table Colonnes**: ID, Nom Complet, Email, Sujet, Message (truncated), Statut, Date, Actions
- **Status Badges**:
  - NEW: Badge rouge "Nouveau"
  - IN_PROGRESS: Badge orange "En cours"
  - RESOLVED: Badge vert "Résolu"
- **Quick Actions**: Boutons rapides changement statut
- **Bulk Operations**: Marquer multiple comme IN_PROGRESS/RESOLVED

## Page Détail

**Affichage:**
- Informations contact (nom, email, téléphone)
- Sujet et message complet
- Date de soumission
- Statut actuel

**Actions:**
- Changer statut (dropdown ou boutons)
- Copier email (pour répondre)
- Supprimer (avec confirmation)
- Notes internes (optionnel - textarea)

## Composants UI

- **ContactRequestCard**: Affichage détails avec status badge
- **StatusSelector**: Dropdown changement statut
- **ContactInfo**: Display nom, email, téléphone formaté
- **MessageDisplay**: Affichage message avec whitespace preserved

## Validation

- Pas de création côté admin (lecture seule)
- Changement statut: NEW → IN_PROGRESS → RESOLVED (workflow)
- Suppression: Confirmation requise

## Notifications (Optionnel)

- Compteur NEW dans sidebar menu
- Desktop notification pour nouvelles demandes (temps réel)
- Email notification admin (configurable)

## Stats Dashboard Widget

**Métriques:**
- Nouvelles demandes aujourd'hui
- Demandes en attente (NEW + IN_PROGRESS)
- Temps moyen de résolution
- Taux de résolution

**Consulter:** graphql-backend-expert (query filters), keen-ui-advisor (table, badges), services-expert
