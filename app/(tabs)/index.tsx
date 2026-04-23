import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PostCard } from '@/components/PostCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFeed } from '@/hooks/useFeed';
import { useAuth } from '@/contexts/AuthContext';

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const { posts, loading, error, refresh, toggleLike } = useFeed();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading && posts.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.subtext }]}>
            Loading feed...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && posts.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.subtext} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Something went wrong
          </Text>
          <Text style={[styles.errorDetail, { color: colors.subtext }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
            onPress={refresh}
            accessibilityLabel="Retry loading feed"
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Feed</Text>
        {user && (
          <TouchableOpacity
            onPress={() => router.push('/compose')}
            accessibilityLabel="Compose new post"
          >
            <Ionicons name="add-circle-outline" size={28} color={colors.tint} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={toggleLike}
            onPress={() => router.push({ pathname: '/post/[id]', params: { id: item.id } })}
            onAuthorPress={() =>
              router.push({ pathname: '/profile/[id]', params: { id: item.author.id } })
            }
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={posts.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              No posts yet. Be the first!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadingText: { marginTop: 12, fontSize: 16 },
  errorText: { fontSize: 18, fontWeight: '600', marginTop: 12 },
  errorDetail: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  retryButton: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
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
  emptyList: { flexGrow: 1 },
  emptyText: { fontSize: 16, marginTop: 12 },
});
