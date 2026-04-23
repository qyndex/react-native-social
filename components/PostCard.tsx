import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { Post } from '@/types/social';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onPress: () => void;
  onAuthorPress: () => void;
}

export function PostCard({ post, onLike, onPress, onAuthorPress }: PostCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const relativeTime = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3_600_000);
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={`Post by ${post.author.name}`}
    >
      <TouchableOpacity
        style={styles.avatar}
        onPress={onAuthorPress}
        accessibilityLabel={`View ${post.author.name}'s profile`}
      >
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.tint }]}>
          <Text style={styles.avatarInitial}>
            {post.author.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.body}>
        <View style={styles.authorRow}>
          <Text style={[styles.authorName, { color: colors.text }]}>{post.author.name}</Text>
          <Text style={[styles.handle, { color: colors.subtext }]}>{post.author.handle}</Text>
          <Text style={[styles.time, { color: colors.subtext }]}>
            {relativeTime(post.createdAt)}
          </Text>
        </View>
        <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onLike(post.id)}
            accessibilityLabel={post.liked ? 'Unlike post' : 'Like post'}
          >
            <Ionicons
              name={post.liked ? 'heart' : 'heart-outline'}
              size={20}
              color={post.liked ? '#ef4444' : colors.icon}
            />
            <Text style={[styles.actionCount, { color: colors.subtext }]}>{post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onPress}
            accessibilityLabel="View comments"
          >
            <Ionicons name="chatbubble-outline" size={20} color={colors.icon} />
            <Text style={[styles.actionCount, { color: colors.subtext }]}>
              {post.comments}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            accessibilityLabel="Share post"
          >
            <Ionicons
              name={Platform.select({ ios: 'share-outline', default: 'share-social-outline' }) ?? 'share-outline'}
              size={20}
              color={colors.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: { marginRight: 12 },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { flex: 1 },
  authorRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 6 },
  authorName: { fontSize: 15, fontWeight: '600', marginRight: 4 },
  handle: { fontSize: 13, marginRight: 4 },
  time: { fontSize: 12 },
  content: { fontSize: 15, lineHeight: 22, marginBottom: 10 },
  actions: { flexDirection: 'row', gap: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionCount: { fontSize: 13 },
});
