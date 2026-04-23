-- Seed data for local development
-- These UUIDs are deterministic so FK references are stable.
-- In production, profiles are auto-created by the on_auth_user_created trigger.

-- ============================================================
-- 5 Users / Profiles
-- ============================================================
INSERT INTO profiles (id, username, full_name, bio, avatar_url) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'alice_chen',   'Alice Chen',   'Full-stack dev. Shipping React Native apps since 2019.', NULL),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'bob_patel',    'Bob Patel',    'Mobile engineer @ Acme. Coffee addict.', NULL),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'carol_smith',  'Carol Smith',  'Designer turned developer. Accessibility advocate.', NULL),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'dave_kim',     'Dave Kim',     'Open-source maintainer. Rust + TypeScript.', NULL),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'emma_jones',   'Emma Jones',   'iOS & Android. Building delightful UX.', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 10 Posts
-- ============================================================
INSERT INTO posts (id, author_id, content, image_url, likes_count, created_at) VALUES
  ('b1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001',
   'Just shipped a new feature! Loving expo-router for file-based navigation. The DX is incredible.',
   NULL, 5, NOW() - INTERVAL '1 hour'),

  ('b1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0002-4000-8000-000000000002',
   'React Native + TypeScript is such a solid combo for cross-platform apps. Strict mode catches so many bugs early.',
   NULL, 3, NOW() - INTERVAL '2 hours'),

  ('b1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0003-4000-8000-000000000003',
   'PSA: safe-area-context handles iOS notches and Android gesture nav perfectly. Stop using magic padding numbers!',
   NULL, 7, NOW() - INTERVAL '5 hours'),

  ('b1b2c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0004-4000-8000-000000000004',
   'Been experimenting with Supabase realtime subscriptions. Live feeds are surprisingly easy to build.',
   NULL, 4, NOW() - INTERVAL '8 hours'),

  ('b1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0005-4000-8000-000000000005',
   'Accessibility tip: always add accessibilityLabel to your TouchableOpacity components. Screen readers thank you.',
   NULL, 6, NOW() - INTERVAL '12 hours'),

  ('b1b2c3d4-0006-4000-8000-000000000006', 'a1b2c3d4-0001-4000-8000-000000000001',
   'Hot take: Expo SDK 51 is the best release yet. EAS Build + Updates make CI/CD a breeze.',
   NULL, 2, NOW() - INTERVAL '1 day'),

  ('b1b2c3d4-0007-4000-8000-000000000007', 'a1b2c3d4-0003-4000-8000-000000000003',
   'Just redesigned our onboarding flow. Conversion went from 23% to 41% by reducing steps from 5 to 3.',
   NULL, 8, NOW() - INTERVAL '1 day 4 hours'),

  ('b1b2c3d4-0008-4000-8000-000000000008', 'a1b2c3d4-0002-4000-8000-000000000002',
   'TIL: FlatList.getItemLayout dramatically improves scroll performance if your items have fixed height.',
   NULL, 3, NOW() - INTERVAL '2 days'),

  ('b1b2c3d4-0009-4000-8000-000000000009', 'a1b2c3d4-0004-4000-8000-000000000004',
   'Released v2.0 of my open-source component library. 40+ components, fully typed, dark mode built-in.',
   NULL, 9, NOW() - INTERVAL '3 days'),

  ('b1b2c3d4-0010-4000-8000-000000000010', 'a1b2c3d4-0005-4000-8000-000000000005',
   'Sunday project: built a custom hook for infinite scroll with cursor-based pagination. Feels buttery smooth.',
   NULL, 5, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 20 Comments
-- ============================================================
INSERT INTO comments (id, post_id, author_id, content, created_at) VALUES
  ('c1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0002-4000-8000-000000000002',
   'Congrats on the launch! expo-router is a game changer.', NOW() - INTERVAL '50 minutes'),
  ('c1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0003-4000-8000-000000000003',
   'The file-based routing makes the project structure so clean.', NOW() - INTERVAL '45 minutes'),
  ('c1b2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0005-4000-8000-000000000005',
   'How does it compare to React Navigation for deep linking?', NOW() - INTERVAL '30 minutes'),

  ('c1b2c3d4-0004-4000-8000-000000000004', 'b1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001',
   'Strict mode is non-negotiable for any serious project IMO.', NOW() - INTERVAL '1 hour 50 minutes'),
  ('c1b2c3d4-0005-4000-8000-000000000005', 'b1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0004-4000-8000-000000000004',
   'Have you tried the new satisfies operator? Pairs great with strict mode.', NOW() - INTERVAL '1 hour 30 minutes'),

  ('c1b2c3d4-0006-4000-8000-000000000006', 'b1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000001',
   'This saved me so many hours. No more platform-specific hacks.', NOW() - INTERVAL '4 hours'),
  ('c1b2c3d4-0007-4000-8000-000000000007', 'b1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0002-4000-8000-000000000002',
   'The library handles edge cases I never even thought of.', NOW() - INTERVAL '3 hours 30 minutes'),
  ('c1b2c3d4-0008-4000-8000-000000000008', 'b1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0005-4000-8000-000000000005',
   'Works great with bottom sheet modals too.', NOW() - INTERVAL '3 hours'),

  ('c1b2c3d4-0009-4000-8000-000000000009', 'b1b2c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0003-4000-8000-000000000003',
   'Realtime is amazing for chat and notifications too.', NOW() - INTERVAL '7 hours'),
  ('c1b2c3d4-0010-4000-8000-000000000010', 'b1b2c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0005-4000-8000-000000000005',
   'What latency are you seeing on the websocket connection?', NOW() - INTERVAL '6 hours'),

  ('c1b2c3d4-0011-4000-8000-000000000011', 'b1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0001-4000-8000-000000000001',
   'This is so important. Thank you for spreading the word!', NOW() - INTERVAL '11 hours'),
  ('c1b2c3d4-0012-4000-8000-000000000012', 'b1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0004-4000-8000-000000000004',
   'accessibilityRole is another good one people miss.', NOW() - INTERVAL '10 hours'),

  ('c1b2c3d4-0013-4000-8000-000000000013', 'b1b2c3d4-0006-4000-8000-000000000006', 'a1b2c3d4-0002-4000-8000-000000000002',
   'EAS Build saved our team from maintaining native build infra.', NOW() - INTERVAL '23 hours'),

  ('c1b2c3d4-0014-4000-8000-000000000014', 'b1b2c3d4-0007-4000-8000-000000000007', 'a1b2c3d4-0004-4000-8000-000000000004',
   'Those numbers are impressive! What did the redesign look like?', NOW() - INTERVAL '1 day 2 hours'),
  ('c1b2c3d4-0015-4000-8000-000000000015', 'b1b2c3d4-0007-4000-8000-000000000007', 'a1b2c3d4-0005-4000-8000-000000000005',
   'Fewer steps always wins. People underestimate friction.', NOW() - INTERVAL '1 day 1 hour'),

  ('c1b2c3d4-0016-4000-8000-000000000016', 'b1b2c3d4-0008-4000-8000-000000000008', 'a1b2c3d4-0003-4000-8000-000000000003',
   'This is a great tip. Also helps with scrollToIndex reliability.', NOW() - INTERVAL '1 day 20 hours'),

  ('c1b2c3d4-0017-4000-8000-000000000017', 'b1b2c3d4-0009-4000-8000-000000000009', 'a1b2c3d4-0001-4000-8000-000000000001',
   'Been using v1 for months. Excited to check out the new components!', NOW() - INTERVAL '2 days 20 hours'),
  ('c1b2c3d4-0018-4000-8000-000000000018', 'b1b2c3d4-0009-4000-8000-000000000009', 'a1b2c3d4-0002-4000-8000-000000000002',
   'Dark mode support out of the box is huge. Thank you!', NOW() - INTERVAL '2 days 18 hours'),
  ('c1b2c3d4-0019-4000-8000-000000000019', 'b1b2c3d4-0009-4000-8000-000000000009', 'a1b2c3d4-0005-4000-8000-000000000005',
   'Any plans for web support with react-native-web?', NOW() - INTERVAL '2 days 16 hours'),

  ('c1b2c3d4-0020-4000-8000-000000000020', 'b1b2c3d4-0010-4000-8000-000000000010', 'a1b2c3d4-0003-4000-8000-000000000003',
   'Would love to see the source! Are you planning to open-source it?', NOW() - INTERVAL '3 days 20 hours')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 15 Likes
-- ============================================================
INSERT INTO likes (id, post_id, user_id, created_at) VALUES
  ('d1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0002-4000-8000-000000000002', NOW() - INTERVAL '55 minutes'),
  ('d1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0003-4000-8000-000000000003', NOW() - INTERVAL '50 minutes'),
  ('d1b2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0004-4000-8000-000000000004', NOW() - INTERVAL '40 minutes'),
  ('d1b2c3d4-0004-4000-8000-000000000004', 'b1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0005-4000-8000-000000000005', NOW() - INTERVAL '30 minutes'),
  ('d1b2c3d4-0005-4000-8000-000000000005', 'b1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', NOW() - INTERVAL '20 minutes'),

  ('d1b2c3d4-0006-4000-8000-000000000006', 'b1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001', NOW() - INTERVAL '1 hour 45 minutes'),
  ('d1b2c3d4-0007-4000-8000-000000000007', 'b1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0004-4000-8000-000000000004', NOW() - INTERVAL '1 hour 30 minutes'),
  ('d1b2c3d4-0008-4000-8000-000000000008', 'b1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0005-4000-8000-000000000005', NOW() - INTERVAL '1 hour 20 minutes'),

  ('d1b2c3d4-0009-4000-8000-000000000009', 'b1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000001', NOW() - INTERVAL '4 hours 30 minutes'),
  ('d1b2c3d4-0010-4000-8000-000000000010', 'b1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0002-4000-8000-000000000002', NOW() - INTERVAL '4 hours'),
  ('d1b2c3d4-0011-4000-8000-000000000011', 'b1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0004-4000-8000-000000000004', NOW() - INTERVAL '3 hours 45 minutes'),
  ('d1b2c3d4-0012-4000-8000-000000000012', 'b1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0005-4000-8000-000000000005', NOW() - INTERVAL '3 hours 30 minutes'),

  ('d1b2c3d4-0013-4000-8000-000000000013', 'b1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0002-4000-8000-000000000002', NOW() - INTERVAL '11 hours'),
  ('d1b2c3d4-0014-4000-8000-000000000014', 'b1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0003-4000-8000-000000000003', NOW() - INTERVAL '10 hours 30 minutes'),

  ('d1b2c3d4-0015-4000-8000-000000000015', 'b1b2c3d4-0009-4000-8000-000000000009', 'a1b2c3d4-0001-4000-8000-000000000001', NOW() - INTERVAL '2 days 22 hours')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 8 Follows
-- ============================================================
INSERT INTO follows (id, follower_id, following_id, created_at) VALUES
  ('e1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0002-4000-8000-000000000002', NOW() - INTERVAL '7 days'),
  ('e1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0003-4000-8000-000000000003', NOW() - INTERVAL '6 days'),
  ('e1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001', NOW() - INTERVAL '7 days'),
  ('e1b2c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000001', NOW() - INTERVAL '5 days'),
  ('e1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0001-4000-8000-000000000001', NOW() - INTERVAL '4 days'),
  ('e1b2c3d4-0006-4000-8000-000000000006', 'a1b2c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0003-4000-8000-000000000003', NOW() - INTERVAL '3 days'),
  ('e1b2c3d4-0007-4000-8000-000000000007', 'a1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0001-4000-8000-000000000001', NOW() - INTERVAL '2 days'),
  ('e1b2c3d4-0008-4000-8000-000000000008', 'a1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0004-4000-8000-000000000004', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;
