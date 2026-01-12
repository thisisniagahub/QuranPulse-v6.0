# GitHub Copilot Instructions - QuranPulse v6.0

## Project Context

QuranPulse v6.0 ("Noor-e-Cyber") is a futuristic Islamic Progressive Web App featuring Ustaz AI, Iqra Digital, and Pulse Command Center.

**Phase:** PRODUCTION
**URL:** https://quranpulse.my

## Tech Stack

- React 18 + Vite + TypeScript
- Tailwind CSS v4 + Framer Motion
- Supabase (PostgreSQL + Auth + Edge Functions)
- Zustand (global state) + React Query (server state)
- Jest + React Testing Library

## Coding Style

- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Tailwind CSS for styling (glassmorphism + neon aesthetics)
- Use Framer Motion for animations
- Use Zustand for global state management
- Use React Query for server state management

## Naming Conventions

- camelCase for variables and functions
- PascalCase for components and types
- kebab-case for file names
- SCREAMING_SNAKE_CASE for constants

## File Organization

```
src/modules/        Feature modules (quran, iqra, smart-deen)
src/services/       API services (aiService, quranService)
src/components/     Shared UI components
src/contexts/       React contexts
src/hooks/          Custom hooks
```

## Do

- Include TypeScript types for all props
- Use async/await for asynchronous operations
- Include error handling with try/catch
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Run verification before completion

## Do Not

- Generate hardcoded API keys or secrets
- Use deprecated APIs or patterns
- Skip error handling
- Use class components
- Use inline styles (use Tailwind)
- Skip TypeScript types

## Testing

- Use Jest + React Testing Library
- Write unit tests for new logic
- Test both success and error cases
- Mock external dependencies

## Commit Format

`[AGENT:Copilot] type: description`

Types: feat, fix, docs, refactor, test, deploy
