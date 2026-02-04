# CnC: Tiberium Alliances - Lineup Optimizer

A web application that analyzes screenshots of Command & Conquer: Tiberium Alliances game screens and recommends optimal attack lineups with strategic wave plans.

## Features

- **Screenshot Analysis**: Upload images of your units and enemy defenses
- **Smart Recommendations**: AI-powered lineup suggestions based on multiple objectives
- **Wave Planning**: Strategic deployment guides for multi-wave attacks
- **Unit Database**: Comprehensive stats for all GDI, Nod, and Forgotten units
- **Multiple Objectives**: Optimize for win chance, repair time, power cost, or loot efficiency
- **Preset Management**: Save and reuse successful lineup configurations
- **Battle Reports**: Track outcomes to improve future recommendations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Next.js API Routes (Vercel Serverless Functions)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account and project
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Warr10rOfOdin/tib-software.git
cd tib-software
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase**

- Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- Enable Authentication (Google provider)
- Create a Firestore database
- Create a Storage bucket
- Download service account credentials

4. **Configure environment variables**

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

5. **Deploy Firestore and Storage rules**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in the project (select Firestore and Storage)
firebase init

# Deploy rules
firebase deploy --only firestore:rules,storage:rules
```

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tib-software/
├── app/                      # Next.js app directory
│   ├── analyze/             # Analysis creation page
│   ├── results/             # Results display pages
│   ├── history/             # Analysis history
│   ├── presets/             # Saved presets
│   ├── units/               # Unit database browser
│   ├── api/                 # API routes (to be implemented)
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── engine/              # Recommendation engine
│   ├── firebase/            # Firebase config and hooks
│   ├── unit-stats.ts        # Unit data utilities
│   └── utils.ts             # Helper functions
├── types/
│   └── index.ts             # TypeScript type definitions
├── data/
│   └── unit_stats.seed.json # Unit statistics data
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
└── README.md
```

## Architecture

### Recommendation Engine

The core engine (`lib/engine/recommendation-engine.ts`) implements:

1. **Defender Analysis**: Analyzes enemy composition to identify threats
2. **Doctrine Selection**: Chooses strategic approach based on target type
3. **Lineup Building**: Constructs optimal unit composition within CP constraints
4. **Wave Planning**: Generates multi-wave deployment strategies
5. **Scoring**: Evaluates lineups based on selected objective

### Doctrine System

The engine uses several doctrines:

- **Anti-Infantry**: Counters infantry-heavy camps with area damage units
- **Anti-Vehicle**: Deploys anti-tank units against vehicle threats
- **Base Assault**: Structure-focused units for base attacks
- **Balanced**: Mixed composition for versatile engagements

### Objectives

Users can optimize for:

- **Max Win Chance**: Most powerful lineup for guaranteed victory
- **Min Repair Time**: Minimize downtime with cheap, expendable units
- **Min Power Cost**: Reduce resource consumption for repairs
- **Max Loot/Minute**: Balance speed and efficiency for farming

## Data Model

### Collections

- **users**: User profiles and settings
- **analyses**: Screenshot analysis results and recommendations
- **battleReports**: Post-battle outcome data
- **unitStats**: Unit statistics (read-only)
- **presets**: Saved lineup configurations

See `types/index.ts` for detailed schema definitions.

## Development Roadmap

### Phase 1: MVP (Current)
- ✅ Basic UI and navigation
- ✅ Recommendation engine
- ✅ Unit database
- ✅ Demo results page
- ⏳ Screenshot upload
- ⏳ Image parsing (OCR)
- ⏳ Firebase integration

### Phase 2: Core Features
- Authentication UI
- Real analysis workflow
- Manual data correction
- Analysis history
- Battle report tracking

### Phase 3: Advanced Features
- Preset management
- Template matching for icons
- Improved OCR accuracy
- Alternative lineup suggestions
- Learning from battle reports

### Phase 4: Optimization
- Candidate lineup generation
- Multi-objective optimization
- User-specific calibration
- Performance tuning

## Contributing

This is a personal project. If you have suggestions or find bugs, please open an issue.

## Compliance Note

This tool is an **advisor** that analyzes screenshots and provides recommendations. It does not:

- Automate gameplay
- Connect to EA servers
- Inject actions into the game
- Violate Command & Conquer: Tiberium Alliances Terms of Service

Users are responsible for ensuring their use complies with game rules.

## License

This project is for educational and personal use.

## Acknowledgments

- TACS (Tiberium Alliances Combat Simulator) community
- Command & Conquer: Tiberium Alliances community wikis
- Unit statistics contributors

## Contact

For questions or support, open an issue on GitHub.
