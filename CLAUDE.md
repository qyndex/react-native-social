# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Social -- a social feed app with posts, author profiles, likes, comments, and pull-to-refresh. Built with Expo SDK 51, expo-router (file-based navigation), React Native 0.74, and TypeScript in strict mode. Supports iOS, Android, and web via react-native-web.

## Commands

```bash
npm install                # Install dependencies
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

## Architecture

- `app/` -- Expo Router file-based routing (layout in `_layout.tsx`, tabs in `(tabs)/`)
- `app/(tabs)/index.tsx` -- Main feed screen with FlatList, pull-to-refresh, like toggling
- `app/_layout.tsx` -- Root Stack navigator with StatusBar, profile/[id] and post/[id] routes
- `components/PostCard.tsx` -- Reusable post card with avatar, author info, relative time, like/comment/share actions
- `constants/Colors.ts` -- Light and dark color scheme tokens (text, background, tint, icon, subtext, border, card, tab icons)
- `hooks/useColorScheme.ts` -- Wrapper around RN useColorScheme that defaults to 'light' when null
- `types/social.ts` -- TypeScript interfaces: `Author` (id, name, handle, avatar) and `Post` (id, author, content, likes, comments, createdAt, liked)
- `src/` -- Stub placeholder files (not production code)
- `__tests__/` -- Jest test suites organized by feature: components, screens, hooks, constants, types

## Key Patterns

- **Path aliases**: `@/*` maps to project root (configured in tsconfig.json `paths`)
- **Color scheme**: Components use `useColorScheme()` hook + `Colors[colorScheme]` for theming
- **Navigation**: `router.push()` from expo-router for programmatic navigation
- **Accessibility**: All interactive elements have `accessibilityLabel` props
- **Platform guards**: `Platform.select()` and `Platform.OS` for cross-platform behavior (e.g. scroll indicator, share icon)
- **Relative time**: PostCard computes relative time inline (just now / Xh ago / Xd ago)
- **Mock data**: Feed uses hardcoded MOCK_POSTS array (replace with API integration)

## Testing

Tests live in `__tests__/` and use Jest with jest-expo preset + @testing-library/react-native.

```bash
npm test                              # Run all tests
npm test -- --testPathPattern=PostCard # Run specific test file
npm test -- --coverage                # Coverage report
```

Test conventions:
- Component tests mock `@expo/vector-icons`, `expo-router`, `react-native-safe-area-context`
- Hook tests mock `react-native` useColorScheme return value
- Use `screen.getByLabelText()` to find accessible interactive elements
- Use `fireEvent.press()` for touch interactions
- Jest module name mapper resolves `@/*` aliases in test imports

## Environment Variables

Copy `.env.example` to `.env` and fill in values:
- `API_URL` / `EXPO_PUBLIC_API_URL` -- Backend API base URL
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
