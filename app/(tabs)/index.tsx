import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PostCard } from '@/components/PostCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { Post } from '@/types/social';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: { id: 'u1', name: 'Alice Chen', avatar: null, handle: '@alice' },
    content: 'Just shipped a new feature! Loving expo-router for file-based nav.',
    likes: 42,
    comments: 8,
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    liked: false,
  },
  {
    id: '2',
    author: { id: 'u2', name: 'Bob Patel', avatar: null, handle: '@bob' },
    content: 'React Native + TypeScript is such a solid combo for cross-platform apps.',
    likes: 27,
    comments: 5,
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
    liked: true,
  },
  {
    id: '3',
    author: { id: 'u3', name: 'Carol Smith', avatar: null, handle: '@carol' },
    content: 'PSA: safe-area-context handles iOS notches and Android gesture nav perfectly.',
    likes: 61,
    comments: 12,
    createdAt: new Date(Date.now() - 86400_000).toISOString(),
    liked: false,
  },
];

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p,
      ),
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Feed</Text>
        <TouchableOpacity
          onPress={() => router.push('/compose')}
          accessibilityLabel="Compose new post"
        >
          <Ionicons name="add-circle-outline" size={28} color={colors.tint} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={handleLike}
            onPress={() => router.push({ pathname: '/post/[id]', params: { id: item.id } })}
            onAuthorPress={() =>
              router.push({ pathname: '/profile/[id]', params: { id: item.author.id } })
            }
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 24, fontWeight: '700' },
  list: { paddingBottom: 20 },
});
