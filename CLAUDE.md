# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Social -- a full-featured social feed app with Supabase backend. Posts, profiles, likes, comments, follows, and auth. Built with Expo SDK 51, expo-router (file-based navigation), React Native 0.74, TypeScript strict mode, and Supabase (auth + PostgreSQL + RLS). Supports iOS, Android, and web via react-native-web.

## Commands

```bash
npm install                # Install dependencies
npx supabase start         # Start local Supabase (Docker required)
npx supabase db reset      # Apply migrations + seed data
npx expo start             # Start Expo dev server (press i/a/w for platform)
npx expo start --ios       # Start iOS simulator
npx expo start --android   # Start Android emulator
npx expo start --web       # Start web dev server
npm test                   # Run Jest tests
npm test -- --watch        # Run tests in watch mode
npm test -- --coverage     # Run tests with coverage report
npx tsc --noEmit           # Type check
npm run lint               # ESLint
npm run build:web          # Export static web build
```

## Quick Start

```bash
npm install
npx supabase start         # Note the anon key + API URL from output
cp .env.example .env        # Edit .env with the values from supabase start
npx supabase db reset       # Apply schema + seed data (5 users, 10 posts, 20 comments)
npx expo start
```

## Architecture

- `app/` -- Expo Router file-based routing
  - `_layout.tsx` -- Root layout with AuthProvider, auth redirect logic
  - `(auth)/` -- Sign-in and sign-up screens
  - `(tabs)/` -- Tab navigator: Feed, Search, Profile
  - `profile/[id].tsx` -- User profile with posts + follow/unfollow
  - `post/[id].tsx` -- Post detail with comments + comment input
  - `compose.tsx` -- New post modal
- `lib/supabase.ts` -- Supabase client with AsyncStorage persistence
- `contexts/AuthContext.tsx` -- Auth state provider (session, signIn, signUp, signOut)
- `hooks/useFeed.ts` -- Feed data fetching + optimistic like toggling
- `hooks/useProfile.ts` -- Profile data + follow toggle
- `hooks/useComments.ts` -- Comments list + add comment
- `hooks/useColorScheme.ts` -- Light/dark theme wrapper
- `components/PostCard.tsx` -- Reusable post card with avatar, relative time, like/comment/share
- `constants/Colors.ts` -- Light and dark color scheme tokens
- `types/social.ts` -- App-level TypeScript interfaces (Author, Post, Comment, Profile)
- `types/database.ts` -- Supabase database row/insert/update types
- `supabase/migrations/` -- SQL schema (profiles, posts, comments, likes, follows)
- `supabase/seed.sql` -- Development seed data
- `__tests__/` -- Jest test suites organized by feature

## Database Schema

Five tables with RLS enabled on all:

| Table | Key columns | RLS |
|-------|-------------|-----|
| `profiles` | id (FK auth.users), username (UNIQUE), full_name, bio, avatar_url | Public read, self write |
| `posts` | id, author_id (FK profiles), content, image_url, likes_count | Public read, author write |
| `comments` | id, post_id (FK posts), author_id (FK profiles), content | Public read, author write |
| `likes` | id, post_id (FK posts), user_id (FK profiles), UNIQUE(post_id, user_id) | Public read, self write |
| `follows` | id, follower_id, following_id, UNIQUE(follower_id, following_id) | Public read, self write |

Triggers:
- `on_auth_user_created` -- auto-creates profile row on signup
- `on_like_changed` -- increments/decrements `posts.likes_count`

## Key Patterns

- **Path aliases**: `@/*` maps to project root (configured in tsconfig.json `paths`)
- **Color scheme**: Components use `useColorScheme()` hook + `Colors[colorScheme]` for theming
- **Navigation**: `router.push()` / `router.replace()` from expo-router
- **Auth flow**: AuthProvider wraps app; root layout redirects to `(auth)/sign-in` when no session
- **Data fetching**: Custom hooks (`useFeed`, `useProfile`, `useComments`) with loading/error/data states
- **Optimistic updates**: Like toggling and follow/unfollow update UI before server confirms
- **Supabase client**: `lib/supabase.ts` uses AsyncStorage for session persistence
- **Accessibility**: All interactive elements have `accessibilityLabel` props
- **Platform guards**: `Platform.select()` for cross-platform behavior

## Testing

Tests live in `__tests__/` and use Jest with jest-expo preset + @testing-library/react-native.

```bash
npm test                              # Run all tests
npm test -- --testPathPattern=PostCard # Run specific test file
npm test -- --coverage                # Coverage report
```

Test conventions:
- Component tests mock `@expo/vector-icons`, `expo-router`, `react-native-safe-area-context`
- Hook-dependent screens mock the hooks (`useFeed`, `useAuth`, etc.)
- Auth context tests mock `lib/supabase`
- Use `screen.getByLabelText()` to find accessible interactive elements
- Use `fireEvent.press()` for touch interactions
- Jest module name mapper resolves `@/*` aliases in test imports

## Environment Variables

Copy `.env.example` to `.env` and fill in values:
- `EXPO_PUBLIC_SUPABASE_URL` -- Supabase project URL (local: `http://127.0.0.1:54321`)
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` -- Supabase anonymous/public key
- `SENTRY_DSN` -- Error tracking (optional)
- `ANALYTICS_KEY` -- Analytics service key (optional)

Expo only exposes vars prefixed with `EXPO_PUBLIC_` to client code.

## Rules

- TypeScript strict mode -- no `any` types
- Use Expo SDK APIs over bare React Native where available
- StyleSheet.create for all styles (no inline style objects in render)
- All interactive elements require `accessibilityLabel`
- Error + loading states on all data-fetching components
- Test with both iOS and Android before shipping
- Keep light/dark color tokens in sync in `constants/Colors.ts`
- All new components need corresponding test files in `__tests__/`
- Supabase queries go through typed hooks, not directly in components
- RLS policies required on every new table
- Use `IF NOT EXISTS` for all DDL in migrations
