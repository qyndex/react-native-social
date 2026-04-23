import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Comment } from '@/types/social';

interface UseCommentsResult {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  addComment: (content: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useComments(postId: string): UseCommentsResult {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('*, profiles!comments_author_id_fkey(id, username, full_name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const mapped: Comment[] = (data ?? []).map((c) => {
        const profile = c.profiles as unknown as {
          id: string;
          username: string;
          full_name: string;
          avatar_url: string | null;
        };
        return {
          id: c.id,
          postId: c.post_id,
          author: {
            id: profile.id,
            name: profile.full_name || profile.username,
            handle: `@${profile.username}`,
            avatar: profile.avatar_url,
          },
          content: c.content,
          createdAt: c.created_at,
        };
      });

      setComments(mapped);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load comments';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchComments();
  }, [fetchComments]);

  const addComment = useCallback(
    async (content: string) => {
      if (!user) return;

      const { error: insertError } = await supabase.from('comments').insert({
        post_id: postId,
        author_id: user.id,
        content,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      await fetchComments();
    },
    [user, postId, fetchComments],
  );

  return { comments, loading, error, addComment, refresh };
}
