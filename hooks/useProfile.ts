import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Post, Profile } from '@/types/social';

interface UseProfileResult {
  profile: Profile | null;
  posts: Post[];
  loading: boolean;
  error: string | null;
  toggleFollow: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProfile(profileId: string): UseProfileResult {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setError(null);
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (profileError) throw profileError;

      // Fetch counts in parallel
      const [postsResult, followersResult, followingResult, isFollowingResult] =
        await Promise.all([
          supabase
            .from('posts')
            .select('id', { count: 'exact', head: true })
            .eq('author_id', profileId),
          supabase
            .from('follows')
            .select('id', { count: 'exact', head: true })
            .eq('following_id', profileId),
          supabase
            .from('follows')
            .select('id', { count: 'exact', head: true })
            .eq('follower_id', profileId),
          user
            ? supabase
                .from('follows')
                .select('id')
                .eq('follower_id', user.id)
                .eq('following_id', profileId)
                .maybeSingle()
            : Promise.resolve({ data: null }),
        ]);

      setProfile({
        id: profileData.id,
        username: profileData.username,
        fullName: profileData.full_name,
        bio: profileData.bio,
        avatarUrl: profileData.avatar_url,
        postsCount: postsResult.count ?? 0,
        followersCount: followersResult.count ?? 0,
        followingCount: followingResult.count ?? 0,
        isFollowing: isFollowingResult.data !== null,
      });

      // Fetch user's posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*, profiles!posts_author_id_fkey(id, username, full_name, avatar_url)')
        .eq('author_id', profileId)
        .order('created_at', { ascending: false });

      // Fetch user's likes for these posts
      let userLikes = new Set<string>();
      if (user && postsData) {
        const postIds = postsData.map((p) => p.id);
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);
        userLikes = new Set((likesData ?? []).map((l) => l.post_id));
      }

      // Comment counts
      const postIds = (postsData ?? []).map((p) => p.id);
      const { data: commentCounts } = await supabase
        .from('comments')
        .select('post_id')
        .in('post_id', postIds);

      const commentCountMap = new Map<string, number>();
      (commentCounts ?? []).forEach((c) => {
        commentCountMap.set(c.post_id, (commentCountMap.get(c.post_id) ?? 0) + 1);
      });

      const mapped: Post[] = (postsData ?? []).map((p) => {
        const prof = p.profiles as unknown as {
          id: string;
          username: string;
          full_name: string;
          avatar_url: string | null;
        };
        return {
          id: p.id,
          author: {
            id: prof.id,
            name: prof.full_name || prof.username,
            handle: `@${prof.username}`,
            avatar: prof.avatar_url,
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
      const message = err instanceof Error ? err.message : 'Failed to load profile';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [profileId, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchProfile();
  }, [fetchProfile]);

  const toggleFollow = useCallback(async () => {
    if (!user || !profile) return;

    // Optimistic update
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            isFollowing: !prev.isFollowing,
            followersCount: prev.isFollowing
              ? prev.followersCount - 1
              : prev.followersCount + 1,
          }
        : null,
    );

    try {
      if (profile.isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profileId);
      } else {
        await supabase
          .from('follows')
          .insert({ follower_id: user.id, following_id: profileId });
      }
    } catch {
      // Revert on failure
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: profile.isFollowing,
              followersCount: profile.followersCount,
            }
          : null,
      );
    }
  }, [user, profile, profileId]);

  return { profile, posts, loading, error, toggleFollow, refresh };
}
