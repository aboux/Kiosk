# Kiosk 

## 🚀 Comment lancer le projet

### Prérequis

- **Node.js** >= 18
- **npm** >= 9
- **Docker** & **Docker Compose** (pour PostgreSQL)

### Installation rapide

```bash
# 1. Démarrer la base de données PostgreSQL
docker-compose up -d

# 2. Installer et lancer le backend
cd backend
npm install
npm run seed           # Génère Prisma, applique les migrations et charge les questions
npm run start:dev      # Lance le serveur sur http://localhost:3000

# 3. Dans un autre terminal, installer et lancer le frontend
cd frontend
npm install
npm run dev            # Lance l'application sur http://localhost:5173
```

Ouvrez votre navigateur sur **http://localhost:5173** et vous verrez le formulaire de questions.

---

## 📖 Documentation de l'API

Le backend expose une documentation Swagger interactive :

👉 **http://localhost:3000/api/docs**

Vous y trouverez tous les endpoints disponibles :
- `GET /v1/questions` - Récupère l'arbre hiérarchique des questions
- `POST /v1/answers` - Enregistre les réponses utilisateur

---

## 🧪 Tests

### Tests unitaires

```bash
# Backend (Jest)
cd backend
npm test

# Frontend (Vitest)
cd frontend
npm run test:run
```

### Lancer tous les tests

```bash
npm run test:all
```

---

## 🏗️ Architecture technique

### Stack technologique

**Backend**
- **NestJS** – Framework Node.js moderne et modulaire
- **Prisma** – ORM type-safe pour PostgreSQL
- **TypeScript** – Typage statique
- **Swagger** – Documentation API auto-générée

**Frontend**
- **React 19** – Librairie UI avec hooks
- **Redux Toolkit** – Gestion d'état centralisée
- **RTK Query** – Fetching de données avec cache
- **React Hook Form** + **Zod** – Gestion et validation de formulaires
- **Radix UI** + **Tailwind CSS** – Composants accessibles et stylisés
- **Vite** – Build tool ultra-rapide

**Infrastructure**
- **PostgreSQL 15** – Base de données relationnelle
- **Docker Compose** – Orchestration locale
- **Playwright** – Tests E2E multi-navigateurs

### Structure du projet

```
kiosk/
├── backend/                # API NestJS
│   ├── src/
│   │   ├── questions/      # Module questions (GET)
│   │   ├── answers/        # Module réponses (POST)
│   │   └── prisma/         # Service Prisma
│   ├── prisma/
│   │   ├── schema.prisma   # Modèle de données
│   │   ├── migrations/     # Historique des migrations
│   │   └── seed.ts         # Import CSV -> DB
│   └── data/
│       └── questions.csv   # Catalogue de questions
│
├── frontend/               # App React + Redux
│   ├── src/
│   │   ├── components/
│   │   │   ├── question/   # Rendu récursif des questions
│   │   │   ├── inputs/     # Inputs typés (Number, Text, Enum)
│   │   │   └── header/     # Sélecteur de langue
│   │   ├── store/
│   │   │   └── slices/     # Redux slices (questions, answers)
│   │   ├── services/       # API calls (RTK Query)
│   │   └── schemas/        # Validation Zod
│   └── ...
│
├── tests/                  # Tests E2E Playwright
│   ├── kiosk-form.spec.ts
│   ├── api-integration.spec.ts
│   └── error-handling.spec.ts
│
├── docker-compose.yml      # PostgreSQL local
└── playwright.config.ts    # Config E2E
```

---

## 📝 Utilisation de l'IA

### Comment j'ai utilisé l'IA

J'ai utilisé Claude Code, Copilot et chatGPT tout au long du développement pour :

1. **Architecture initiale**
   - Structure backend/frontend
   - Relecture du code et optimisation

1. **Développement assisté**
   - Debug et Parsing et seed du CSV
   - L'UI et la repasse sur les composant le CSS tailwind

2. **Tests**
   - Écriture des tests unitaires
   - Tests E2E Playwright
   - Debugging et corrections

3. **Docs**
   - Rédaction de la doc

---

## 🚧 Améliorations futures

Si j'avais plus de temps, voici ce que je développerais en priorité :

1. Validation dynamique des formulaires

2. Tables multi-lignes

3. Édition des réponses
- Endpoint `PATCH /v1/answers/:id` pour modifier

4. Validation backend typée
- Actuellement, tout est stocké en `string`

5. Gestion des sessions utilisateur
- Authentification 
- Associer les réponses à un utilisateur
- Sauvegarder des brouillons...

6. Export de données
- exporter les réponses en CSV/Excel

7. Amélioration UX
