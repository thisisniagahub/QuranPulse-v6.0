# QuranPulse-v6.0 Project Context

## Project Overview

QuranPulse-v6.0 is an Islamic AI SuperApp ecosystem built with React, TypeScript, and Vite. It serves as a comprehensive platform for Islamic learning, practice, and community engagement, featuring multiple integrated modules including Quran reading, Islamic education (Iqra), prayer guidance (Ibadah), Islamic commerce (Souq), and AI-powered Islamic guidance (SmartDeen).

## Key Technologies & Architecture

- **Frontend**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 4.1.17 with custom Islamic-themed design
- **Routing**: React Router DOM 7.9.6
- **State Management**: React Context API with custom DataProvider
- **AI Integration**: Google Generative AI (@google/genai) for Islamic guidance
- **Styling**: Framer Motion for animations
- **Backend Options**: Google Sheets API or MongoDB/Express backend

## Project Structure

```
/mnt/h/ANTIGRAVITY/QuranPulse-v6.0/
├── components/          # Reusable UI components
├── modules/             # Main application modules (Dashboard, Quran, SmartDeen, etc.)
├── services/            # Data services, API clients, and context providers
├── .env.local          # Environment variables (GEMINI_API_KEY)
├── App.tsx            # Main application router and authentication flow
├── index.tsx          # React DOM entry point
├── types.ts           # TypeScript type definitions for all entities
├── constants.ts       # AI personas, surah data, and application constants
├── package.json       # Dependencies and scripts
└── ...                # Configuration files (vite.config.ts, tsconfig.json, etc.)
```

## Core Modules

1. **Dashboard**: Main landing page with user statistics
2. **Quran**: Quran reading interface with Arabic text and translations
3. **SmartDeen**: AI-powered Islamic guidance using Ustaz AI persona
4. **Ibadah**: Prayer guidance and Islamic practice tools
5. **Iqra**: Quranic learning and memorization modules
6. **Souq**: Islamic marketplace with product management
7. **MediaStudio**: Content creation tools
8. **Profile**: User profile management
9. **Admin**: Administrative dashboard for content management

## Data Management

The application supports two backend modes:
- **MOCK Mode**: Uses localStorage for development
- **CLOUD Mode**: Connects to Google Sheets API or MongoDB/Express backend

The DataProvider context manages all data operations including products, announcements, users, orders, and system logs.

## AI Personas

The application features multiple specialized AI personas:
- **Ustaz AI**: Islamic scholar following Syafi'i school of thought for Malaysian context
- **Iqra Examiner**: Quranic pronunciation and recitation feedback
- **Jawi Converter**: Malay text to Jawi script conversion
- **Semantic Search**: Quranic verse recommendation based on emotions
- **Doa Generator**: Personalized prayers for donations
- **Hadith Librarian**: Authentic hadith retrieval
- **Learning Planner**: Structured Quranic learning schedules

## Configuration & Environment

- **GEMINI_API_KEY**: Required in .env.local for AI functionality
- **Port**: Runs on port 3000 by default
- **Backend**: Can connect to Google Sheets or external Express/MongoDB server

## Building and Running

```bash
# Install dependencies
npm install

# Set GEMINI_API_KEY in .env.local
GEMINI_API_KEY=your_api_key_here

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development Conventions

- TypeScript for type safety
- React functional components with hooks
- Tailwind CSS for styling with Islamic-themed color palette
- Component-based architecture in modules/ and components/ directories
- Context API for state management
- Google Sheets integration for data persistence (cloud mode)
- Responsive design for mobile and desktop

## Special Features

- Islamic-themed UI with Arabic/Persian language support
- Quranic verse integration with Arabic text and translations
- AI-powered Islamic guidance following Malaysian Syafi'i school
- E-commerce functionality for Islamic products
- User progression tracking with XP and barakah points
- Family member management system
- WhatsApp automation integration (backend)
- Multiple recitation styles and audio support for Quran

## Environment Variables

- `GEMINI_API_KEY`: Google AI API key for AI functionality
- Server connects to external backend at `http://localhost:3001` if available (per BACKEND_README.md)

This project represents a comprehensive Islamic technology platform combining traditional Islamic knowledge with modern AI capabilities, designed specifically for the Malaysian Islamic community context.