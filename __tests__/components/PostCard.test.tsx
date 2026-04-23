import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { PostCard } from '../../components/PostCard';
import type { Post } from '../../types/social';

// Mock expo vector icons
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: ({ name, ...props }: { name: string }) => (
      <Text testID={`icon-${name}`} {...props}>
        {name}
      </Text>
    ),
  };
});

// Mock the custom useColorScheme hook
jest.mock('../../hooks/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

const mockPost: Post = {
  id: 'p1',
  author: { id: 'u1', name: 'Alice Chen', avatar: null, handle: '@alice' },
  content: 'Hello world, this is a test post!',
  likes: 10,
  comments: 3,
  createdAt: new Date(Date.now() - 3_600_000).toISOString(),
  liked: false,
};

const mockLikedPost: Post = {
  ...mockPost,
  id: 'p2',
  liked: true,
  likes: 11,
};

describe('PostCard', () => {
  const onLike = jest.fn();
  const onPress = jest.fn();
  const onAuthorPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders author name, handle, and content', () => {
    render(
      <PostCard
        post={mockPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    expect(screen.getByText('Alice Chen')).toBeTruthy();
    expect(screen.getByText('@alice')).toBeTruthy();
    expect(screen.getByText('Hello world, this is a test post!')).toBeTruthy();
  });

  it('displays like and comment counts', () => {
    render(
      <PostCard
        post={mockPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('renders avatar initial from author name', () => {
    render(
      <PostCard
        post={mockPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    expect(screen.getByText('A')).toBeTruthy();
  });

  it('calls onLike with post id when like button is pressed', () => {
    render(
      <PostCard
        post={mockPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    const likeButton = screen.getByLabelText('Like post');
    fireEvent.press(likeButton);
    expect(onLike).toHaveBeenCalledWith('p1');
  });

  it('calls onPress when card is pressed', () => {
    render(
      <PostCard
        post={mockPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    const card = screen.getByLabelText('Post by Alice Chen');
    fireEvent.press(card);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('calls onAuthorPress when avatar is pressed', () => {
    render(
      <PostCard
        post={mockPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    const avatarButton = screen.getByLabelText("View Alice Chen's profile");
    fireEvent.press(avatarButton);
    expect(onAuthorPress).toHaveBeenCalledTimes(1);
  });

  it('shows unlike label when post is already liked', () => {
    render(
      <PostCard
        post={mockLikedPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    expect(screen.getByLabelText('Unlike post')).toBeTruthy();
  });

  it('shows heart icon for unliked post and filled heart for liked', () => {
    const { unmount } = render(
      <PostCard
        post={mockPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );
    expect(screen.getByTestID('icon-heart-outline')).toBeTruthy();
    unmount();

    render(
      <PostCard
        post={mockLikedPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );
    expect(screen.getByTestID('icon-heart')).toBeTruthy();
  });

  it('displays relative time for recent posts', () => {
    const recentPost: Post = {
      ...mockPost,
      createdAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
    };

    render(
      <PostCard
        post={recentPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    expect(screen.getByText('2h ago')).toBeTruthy();
  });

  it('displays "just now" for very recent posts', () => {
    const justNowPost: Post = {
      ...mockPost,
      createdAt: new Date(Date.now() - 60_000).toISOString(),
    };

    render(
      <PostCard
        post={justNowPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    expect(screen.getByText('just now')).toBeTruthy();
  });

  it('displays days for posts older than 24h', () => {
    const oldPost: Post = {
      ...mockPost,
      createdAt: new Date(Date.now() - 48 * 3_600_000).toISOString(),
    };

    render(
      <PostCard
        post={oldPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    expect(screen.getByText('2d ago')).toBeTruthy();
  });

  it('has share button with accessibility label', () => {
    render(
      <PostCard
        post={mockPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    expect(screen.getByLabelText('Share post')).toBeTruthy();
  });

  it('has view comments button with accessibility label', () => {
    render(
      <PostCard
        post={mockPost}
        onLike={onLike}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    expect(screen.getByLabelText('View comments')).toBeTruthy();
  });
});
