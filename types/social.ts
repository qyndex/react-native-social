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
  likes: number;
  comments: number;
  createdAt: string;
  liked: boolean;
}
