import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import FeedScreen from '../../app/(tabs)/index';
import type { Post } from '../../types/social';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: { push: mockPush },
}));

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

// Mock safe area context
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => (
      <View {...props}>{children}</View>
    ),
  };
});

// Mock the custom useColorScheme hook
jest.mock('../../hooks/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

const mockToggleLike = jest.fn();
const mockRefresh = jest.fn();

// Mock data -- declared with mock prefix so jest.mock hoisting can reference it
const mockPosts: Post[] = [
  {
    id: '1',
    author: { id: 'u1', name: 'Alice Chen', avatar: null, handle: '@alice' },
    content: 'Just shipped a new feature! Loving expo-router for file-based nav.',
    imageUrl: null,
    likes: 42,
    comments: 8,
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    liked: false,
  },
  {
    id: '2',
    author: { id: 'u2', name: 'Bob Patel', avatar: null, handle: '@bob' },
    content: 'React Native + TypeScript is such a solid combo for cross-platform apps.',
    imageUrl: null,
    likes: 27,
    comments: 5,
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
    liked: true,
  },
  {
    id: '3',
    author: { id: 'u3', name: 'Carol Smith', avatar: null, handle: '@carol' },
    content: 'PSA: safe-area-context handles iOS notches and Android gesture nav perfectly.',
    imageUrl: null,
    likes: 61,
    comments: 12,
    createdAt: new Date(Date.now() - 86400_000).toISOString(),
    liked: false,
  },
];

// Mock useFeed hook
jest.mock('../../hooks/useFeed', () => ({
  useFeed: () => ({
    posts: mockPosts,
    loading: false,
    error: null,
    refresh: mockRefresh,
    toggleLike: mockToggleLike,
  }),
}));

// Mock AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    session: { user: { id: 'u1' } },
    user: { id: 'u1' },
    loading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('FeedScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Feed header', () => {
    render(<FeedScreen />);
    expect(screen.getByText('Feed')).toBeTruthy();
  });

  it('renders posts from useFeed hook', () => {
    render(<FeedScreen />);
    expect(screen.getByText('Alice Chen')).toBeTruthy();
    expect(screen.getByText('Bob Patel')).toBeTruthy();
    expect(screen.getByText('Carol Smith')).toBeTruthy();
  });

  it('renders post content', () => {
    render(<FeedScreen />);
    expect(screen.getByText(/Just shipped a new feature/)).toBeTruthy();
    expect(screen.getByText(/React Native \+ TypeScript/)).toBeTruthy();
  });

  it('has a compose button with accessibility label', () => {
    render(<FeedScreen />);
    expect(screen.getByLabelText('Compose new post')).toBeTruthy();
  });

  it('navigates to compose when compose button is pressed', () => {
    render(<FeedScreen />);
    const composeBtn = screen.getByLabelText('Compose new post');
    fireEvent.press(composeBtn);
    expect(mockPush).toHaveBeenCalledWith('/compose');
  });

  it('calls toggleLike when like button is pressed', () => {
    render(<FeedScreen />);
    const likeButtons = screen.getAllByLabelText('Like post');
    fireEvent.press(likeButtons[0]);
    expect(mockToggleLike).toHaveBeenCalledWith('1');
  });

  it('navigates to post detail when a post card is pressed', () => {
    render(<FeedScreen />);
    const postCard = screen.getByLabelText('Post by Alice Chen');
    fireEvent.press(postCard);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/post/[id]',
      params: { id: '1' },
    });
  });

  it('navigates to author profile when avatar is pressed', () => {
    render(<FeedScreen />);
    const avatarButton = screen.getByLabelText("View Alice Chen's profile");
    fireEvent.press(avatarButton);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/profile/[id]',
      params: { id: 'u1' },
    });
  });

  it('displays all post handles', () => {
    render(<FeedScreen />);
    expect(screen.getByText('@alice')).toBeTruthy();
    expect(screen.getByText('@bob')).toBeTruthy();
    expect(screen.getByText('@carol')).toBeTruthy();
  });
});
