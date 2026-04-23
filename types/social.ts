export interface Author {
  id: string;
  name: string;
  handle: string;
  avatar: string | null;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  imageUrl: string | null;
  likes: number;
  comments: number;
  createdAt: string;
  liked: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  content: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  avatarUrl: string | null;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}
