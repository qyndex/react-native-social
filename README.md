# React Native Social

Full-featured social feed app with auth, posts, profiles, likes, comments, and follows. Backed by Supabase for auth, database, and row-level security. Built with Expo SDK 51, expo-router, TypeScript strict mode, and react-native-web.

**Stack:** React Native + Supabase | **Complexity:** moderate
**Tags:** `mobile`, `expo`, `react-native`, `social`, `feed`, `profiles`, `supabase`, `auth`

## Quick Start

```bash
npm install
npx supabase start             # Start local Supabase (requires Docker)
cp .env.example .env            # Fill in EXPO_PUBLIC_SUPABASE_URL + ANON_KEY
npx supabase db reset           # Apply schema + seed data
npx expo start                  # Press i/a/w for iOS/Android/Web
```

## Features

- Email/password authentication (sign up, sign in, sign out)
- Social feed with pull-to-refresh
- Like/unlike posts with optimistic UI updates
- User profiles with posts, followers, and following counts
- Follow/unfollow users
- Post detail with threaded comments
- Compose new posts
- User search
- Light/dark theme support
- Full RLS security -- users can only modify their own data

## Claude Code

This project includes a `CLAUDE.md` file optimized for development with
[Claude Code](https://claude.ai/code). Open the project and Claude will
understand the architecture, commands, and conventions automatically.

## License

MIT - see [LICENSE](LICENSE) for details.

---

Built with [Qyngent](https://qyngent.com)
