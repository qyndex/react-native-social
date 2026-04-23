import type { Author, Post } from '../../types/social';

/**
 * Compile-time type checks for the social types.
 * These tests validate that the type definitions enforce the expected shape.
 * If a type definition changes incompatibly, these tests will fail to compile.
 */
describe('Social types', () => {
  it('Author type has required fields', () => {
    const author: Author = {
      id: 'u1',
      name: 'Test User',
      handle: '@test',
      avatar: null,
    };
    expect(author.id).toBe('u1');
    expect(author.name).toBe('Test User');
    expect(author.handle).toBe('@test');
    expect(author.avatar).toBeNull();
  });

  it('Author avatar can be a string', () => {
    const author: Author = {
      id: 'u2',
      name: 'With Avatar',
      handle: '@avatar',
      avatar: 'https://example.com/avatar.png',
    };
    expect(author.avatar).toBe('https://example.com/avatar.png');
  });

  it('Post type has required fields', () => {
    const post: Post = {
      id: 'p1',
      author: {
        id: 'u1',
        name: 'Test User',
        handle: '@test',
        avatar: null,
      },
      content: 'Test content',
      likes: 5,
      comments: 2,
      createdAt: '2024-01-01T00:00:00.000Z',
      liked: false,
    };
    expect(post.id).toBe('p1');
    expect(post.content).toBe('Test content');
    expect(post.likes).toBe(5);
    expect(post.comments).toBe(2);
    expect(post.liked).toBe(false);
    expect(post.author.id).toBe('u1');
  });

  it('Post liked field is boolean', () => {
    const post: Post = {
      id: 'p2',
      author: { id: 'u1', name: 'A', handle: '@a', avatar: null },
      content: '',
      likes: 0,
      comments: 0,
      createdAt: '',
      liked: true,
    };
    expect(typeof post.liked).toBe('boolean');
  });
});
