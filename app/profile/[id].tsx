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
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PostCard } from '@/components/PostCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const { profile, posts, loading, error, toggleFollow, refresh } = useProfile(id ?? '');
  const [refreshing, setRefreshing] = React.useState(false);

  const isOwnProfile = user?.id === id;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading && !profile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <Ionicons name="person-outline" size={48} color={colors.subtext} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error ?? 'Profile not found'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
            onPress={refresh}
            accessibilityLabel="Retry loading profile"
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const ProfileHeader = () => (
    <View style={styles.profileSection}>
      <View style={[styles.avatarLarge, { backgroundColor: colors.tint }]}>
        <Text style={styles.avatarLargeInitial}>
          {(profile.fullName || profile.username).charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={[styles.name, { color: colors.text }]}>
        {profile.fullName || profile.username}
      </Text>
      <Text style={[styles.handle, { color: colors.subtext }]}>
        @{profile.username}
      </Text>
      {profile.bio ? (
        <Text style={[styles.bio, { color: colors.text }]}>{profile.bio}</Text>
      ) : null}

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {profile.postsCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {profile.followersCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {profile.followingCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Following</Text>
        </View>
      </View>

      {!isOwnProfile && user && (
        <TouchableOpacity
          style={[
            styles.followButton,
            profile.isFollowing
              ? { borderColor: colors.border, borderWidth: 1 }
              : { backgroundColor: colors.tint },
          ]}
          onPress={toggleFollow}
          accessibilityLabel={profile.isFollowing ? 'Unfollow' : 'Follow'}
        >
          <Text
            style={[
              styles.followButtonText,
              { color: profile.isFollowing ? colors.text : '#fff' },
            ]}
          >
            {profile.isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={[styles.divider, { borderBottomColor: colors.border }]} />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Posts</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
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
              No posts yet
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
  errorText: { fontSize: 16, marginTop: 12, textAlign: 'center' },
  retryButton: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
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
  followButton: { marginTop: 20, paddingHorizontal: 32, paddingVertical: 10, borderRadius: 8 },
  followButtonText: { fontSize: 15, fontWeight: '600' },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, width: '100%', marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 16, alignSelf: 'flex-start' },
  list: { paddingBottom: 20 },
  emptyPosts: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 15 },
});
