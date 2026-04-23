import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PostCard } from '@/components/PostCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user, signOut } = useAuth();
  const { profile, posts, loading, error, refresh } = useProfile(user?.id ?? '');
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <Ionicons name="person-circle-outline" size={64} color={colors.subtext} />
          <Text style={[styles.signInPrompt, { color: colors.text }]}>
            Sign in to see your profile
          </Text>
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/(auth)/sign-in')}
            accessibilityLabel="Sign in"
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && !profile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !profile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
            onPress={refresh}
            accessibilityLabel="Retry"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const ProfileHeader = () => (
    <View style={styles.profileSection}>
      <View style={[styles.avatarLarge, { backgroundColor: colors.tint }]}>
        <Text style={styles.avatarLargeInitial}>
          {(profile?.fullName || profile?.username || '?').charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={[styles.name, { color: colors.text }]}>
        {profile?.fullName || profile?.username}
      </Text>
      <Text style={[styles.handle, { color: colors.subtext }]}>
        @{profile?.username}
      </Text>
      {profile?.bio ? (
        <Text style={[styles.bio, { color: colors.text }]}>{profile.bio}</Text>
      ) : null}

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {profile?.postsCount ?? 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {profile?.followersCount ?? 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {profile?.followingCount ?? 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Following</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.signOutButton, { borderColor: colors.border }]}
        onPress={signOut}
        accessibilityLabel="Sign out"
      >
        <Text style={[styles.signOutText, { color: colors.text }]}>Sign Out</Text>
      </TouchableOpacity>

      <View style={[styles.divider, { borderBottomColor: colors.border }]} />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Posts</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ProfileHeader}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() => {}}
            onPress={() => router.push({ pathname: '/post/[id]', params: { id: item.id } })}
            onAuthorPress={() => {}}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        ListEmptyComponent={
          <View style={styles.emptyPosts}>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              No posts yet. Share something!
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
  signInPrompt: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 16 },
  signInButton: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 10 },
  signInButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorText: { fontSize: 16, textAlign: 'center', marginBottom: 12 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { color: '#fff', fontWeight: '600' },
  profileSection: { alignItems: 'center', paddingTop: 24, paddingHorizontal: 16 },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLargeInitial: { color: '#fff', fontSize: 32, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700', marginTop: 12 },
  handle: { fontSize: 15, marginTop: 4 },
  bio: { fontSize: 15, marginTop: 8, textAlign: 'center', lineHeight: 22 },
  stats: { flexDirection: 'row', marginTop: 20, gap: 32 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 13, marginTop: 2 },
  signOutButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  signOutText: { fontSize: 14, fontWeight: '600' },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, width: '100%', marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 16, alignSelf: 'flex-start' },
  list: { paddingBottom: 20 },
  emptyPosts: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 15 },
});
