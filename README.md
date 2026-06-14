# Roomify — Frontend

Frontend Next.js de la marketplace de location d'espaces **Roomify**. Permet aux utilisateurs de découvrir, réserver et gérer des espaces (salles de réunion, coworkings, studios, etc.), et aux propriétaires de publier et administrer leurs annonces.

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) |
| Langage | TypeScript (strict) |
| UI | Tailwind CSS v4 + shadcn/ui |
| Animations | Framer Motion |
| Fetching client | SWR |
| État global | Zustand |
| Auth | iron-session (cookies httpOnly) |

## Architecture

```
app/
├── (auth)/              # Pages publiques : login, register, verify
├── (dashboard)/         # Pages protégées : places, profile, admin
│   ├── places/
│   ├── profile/
│   └── admin/
├── api/                 # BFF — proxy vers l'API Java/Spring Boot
│   ├── auth/            # login, logout, register, me, verify
│   ├── places/          # CRUD espaces
│   ├── profile/         # profil utilisateur + réservations
│   ├── owner/           # gestion propriétaire (espaces, réservations, indispos)
│   └── admin/           # administration (users, places, bookings)
└── layout.tsx

components/              # Composants réutilisables (ui, auth, places, profile…)
hooks/                   # Hooks SWR et métier
lib/                     # Clients API, GraphQL, utilitaires
store/                   # Zustand stores (auth, toasts)
types/                   # Types TypeScript partagés
```

### Patron BFF

Le JWT ne quitte jamais le navigateur : toutes les requêtes passent par les routes `app/api/` qui lisent le cookie httpOnly et ajoutent l'en-tête `Authorization` avant de relayer vers l'API backend.

## Prérequis

- Node.js 18+
- npm

## Installation

```bash
git clone https://github.com/Dodoma95/roomify
cd roomify
npm install
```

Créez un fichier `.env.local` à la racine :

```env
API_BASE_URL=https://roomify-api-1ik6.onrender.com/api/v1
GRAPHQL_URL=https://roomify-api-1ik6.onrender.com/graphql
SESSION_SECRET=<chaine-aleatoire-min-32-chars>
```

## Démarrage

```bash
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run start    # serveur de production
npm run lint     # ESLint
```

## Fonctionnalités

### Visiteurs / Utilisateurs
- Inscription, connexion, vérification email
- Recherche et consultation d'espaces (GraphQL, filtres, pagination)
- Réservation d'un espace avec sélection de créneaux disponibles
- Gestion de son profil et historique de réservations

### Propriétaires (OWNER)
- Publication et modification d'annonces (statut initial : PENDING)
- Consultation des réservations par espace
- Confirmation ou annulation de réservations
- Blocage de périodes d'indisponibilité

### Administrateurs (ADMIN / SUPER_ADMIN)
- Approbation / rejet des annonces en attente
- Gestion des utilisateurs (rôles, suppression)
- Vue globale des réservations

## API Backend

L'application consomme l'API Java/Spring Boot [roomify-api](https://github.com/Dodoma95/roomify-api).

- REST : `https://roomify-api-1ik6.onrender.com/api/v1`
- GraphQL : `https://roomify-api-1ik6.onrender.com/graphql`

Authentification via JWT (header `Authorization: Bearer <token>`), géré côté serveur uniquement.

## Conventions

- Composants en **PascalCase**, hooks en **camelCase** préfixés `use`
- TypeScript strict — pas de `any` non justifié
- Jamais de JWT dans le `localStorage`
- shadcn/ui pour tous les composants UI de base

## Licence

[MIT](LICENSE)