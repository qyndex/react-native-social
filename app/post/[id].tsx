import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { useComments } from '@/hooks/useComments';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/types/social';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const { comments, loading: commentsLoading, addComment } = useComments(id ?? '');

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles!posts_author_id_fkey(id, username, full_name, avatar_url)')
      .eq('id', id)
      .single();

    if (error || !data) {
      setLoading(false);
      return;
    }

    const profile = data.profiles as unknown as {
      id: string;
      username: string;
      full_name: string;
      avatar_url: string | null;
    };

    // Check if user liked
    let liked = false;
    if (user) {
      const { data: likeData } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      liked = likeData !== null;
    }

    setPost({
      id: data.id,
      author: {
        id: profile.id,
        name: profile.full_name || profile.username,
        handle: `@${profile.username}`,
        avatar: profile.avatar_url,
      },
      content: data.content,
      imageUrl: data.image_url,
      likes: data.likes_count,
      comments: comments.length,
      createdAt: data.created_at,
      liked,
    });
    setLoading(false);
  }, [id, user, comments.length]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    await addComment(newComment.trim());
    setNewComment('');
    setSubmitting(false);
  };

  const relativeTime = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3_600_000);
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: colors.text }]}>Post not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const PostHeader = () => (
    <View style={styles.postSection}>
      <TouchableOpacity
        style={styles.authorRow}
        onPress={() =>
          router.push({ pathname: '/profile/[id]', params: { id: post.author.id } })
        }
        accessibilityLabel={`View ${post.author.name}'s profile`}
      >
        <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
          <Text style={styles.avatarInitial}>
            {post.author.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={[styles.authorName, { color: colors.text }]}>
            {post.author.name}
          </Text>
          <Text style={[styles.authorHandle, { color: colors.subtext }]}>
            {post.author.handle}
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>

      <Text style={[styles.postTime, { color: colors.subtext }]}>
        {relativeTime(post.createdAt)}
      </Text>

      <View style={[styles.postStats, { borderColor: colors.border }]}>
        <View style={styles.statRow}>
          <Ionicons name="heart" size={16} color="#ef4444" />
          <Text style={[styles.statText, { color: colors.subtext }]}>
            {post.likes} {post.likes === 1 ? 'like' : 'likes'}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.icon} />
          <Text style={[styles.statText, { color: colors.subtext }]}>
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </Text>
        </View>
      </View>

      <Text style={[styles.commentsTitle, { color: colors.text }]}>Comments</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={PostHeader}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.commentCard, { borderBottomColor: colors.border }]}
              onPress={() =>
                router.push({ pathname: '/profile/[id]', params: { id: item.author.id } })
              }
              accessibilityLabel={`Comment by ${item.author.name}`}
            >
              <View style={[styles.commentAvatar, { backgroundColor: colors.tint }]}>
                <Text style={styles.commentAvatarInitial}>
                  {item.author.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.commentBody}>
                <View style={styles.commentMeta}>
                  <Text style={[styles.commentAuthor, { color: colors.text }]}>
                    {item.author.name}
                  </Text>
                  <Text style={[styles.commentTime, { color: colors.subtext }]}>
                    {relativeTime(item.createdAt)}
                  </Text>
                </View>
                <Text style={[styles.commentContent, { color: colors.text }]}>
                  {item.content}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            commentsLoading ? (
              <ActivityIndicator color={colors.tint} style={styles.commentsLoader} />
            ) : (
              <View style={styles.emptyComments}>
                <Text style={[styles.emptyText, { color: colors.subtext }]}>
                  No comments yet. Be the first!
                </Text>
              </View>
            )
          }
        />

        {user && (
          <View style={[styles.commentInput, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.card },
              ]}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write a comment..."
              placeholderTextColor={colors.subtext}
              multiline
              accessibilityLabel="Comment input"
            />
            <TouchableOpacity
              onPress={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              accessibilityLabel="Post comment"
            >
              <Ionicons
                name="send"
                size={24}
                color={newComment.trim() ? colors.tint : colors.subtext}
              />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16 },
  postSection: { padding: 16 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitial: { color: '#fff', fontSize: 20, fontWeight: '700' },
  authorName: { fontSize: 16, fontWeight: '600' },
  authorHandle: { fontSize: 14, marginTop: 2 },
  postContent: { fontSize: 17, lineHeight: 26, marginBottom: 12 },
  postTime: { fontSize: 13, marginBottom: 16 },
  postStats: {
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 14 },
  commentsTitle: { fontSize: 18, fontWeight: '600', marginTop: 16 },
  list: { paddingBottom: 20 },
  commentCard: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  commentAvatarInitial: { color: '#fff', fontSize: 14, fontWeight: '700' },
  commentBody: { flex: 1 },
  commentMeta: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  commentAuthor: { fontSize: 14, fontWeight: '600' },
  commentTime: { fontSize: 12 },
  commentContent: { fontSize: 15, lineHeight: 22, marginTop: 4 },
  commentsLoader: { marginTop: 20 },
  emptyComments: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 15 },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
});
