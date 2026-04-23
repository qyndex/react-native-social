import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Post } from '@/types/social';

interface UseFeedResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
}

export function useFeed(): UseFeedResult {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    setError(null);
    try {
      // Fetch posts with author profiles
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, profiles!posts_author_id_fkey(id, username, full_name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (postsError) throw postsError;

      // Fetch comment counts per post
      const postIds = (postsData ?? []).map((p) => p.id);
      const { data: commentCounts } = await supabase
        .from('comments')
        .select('post_id')
        .in('post_id', postIds);

      const commentCountMap = new Map<string, number>();
      (commentCounts ?? []).forEach((c) => {
        commentCountMap.set(c.post_id, (commentCountMap.get(c.post_id) ?? 0) + 1);
      });

      // Fetch user's likes if logged in
      let userLikes = new Set<string>();
      if (user) {
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id);
        userLikes = new Set((likesData ?? []).map((l) => l.post_id));
      }

      const mapped: Post[] = (postsData ?? []).map((p) => {
        const profile = p.profiles as unknown as {
          id: string;
          username: string;
          full_name: string;
          avatar_url: string | null;
        };
        return {
          id: p.id,
          author: {
            id: profile.id,
            name: profile.full_name || profile.username,
            handle: `@${profile.username}`,
            avatar: profile.avatar_url,
          },
          content: p.content,
          imageUrl: p.image_url,
          likes: p.likes_count,
          comments: commentCountMap.get(p.id) ?? 0,
          createdAt: p.created_at,
          liked: userLikes.has(p.id),
        };
      });

      setPosts(mapped);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load feed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchFeed();
  }, [fetchFeed]);

  const toggleLike = useCallback(
    async (postId: string) => {
      if (!user) return;

      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      // Optimistic update
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
            : p,
        ),
      );

      try {
        if (post.liked) {
          await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
        } else {
          await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
        }
      } catch {
        // Revert on failure
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, liked: post.liked, likes: post.likes }
              : p,
          ),
        );
      }
    },
    [user, posts],
  );

  return { posts, loading, error, refresh, toggleLike };
}
