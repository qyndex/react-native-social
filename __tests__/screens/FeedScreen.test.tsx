import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import FeedScreen from '../../app/(tabs)/index';

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

describe('FeedScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Feed header', () => {
    render(<FeedScreen />);
    expect(screen.getByText('Feed')).toBeTruthy();
  });

  it('renders mock posts', () => {
    render(<FeedScreen />);
    expect(screen.getByText('Alice Chen')).toBeTruthy();
    expect(screen.getByText('Bob Patel')).toBeTruthy();
    expect(screen.getByText('Carol Smith')).toBeTruthy();
  });

  it('renders post content', () => {
    render(<FeedScreen />);
    expect(
      screen.getByText(/Just shipped a new feature/)
    ).toBeTruthy();
    expect(
      screen.getByText(/React Native \+ TypeScript/)
    ).toBeTruthy();
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

  it('toggles like on a post', () => {
    render(<FeedScreen />);

    // Alice's post starts with 42 likes, unliked
    expect(screen.getByText('42')).toBeTruthy();

    // Find the like button for Alice's post
    const likeButtons = screen.getAllByLabelText('Like post');
    fireEvent.press(likeButtons[0]);

    // Like count should increase to 43
    expect(screen.getByText('43')).toBeTruthy();
  });

  it('un-likes a previously liked post', () => {
    render(<FeedScreen />);

    // Bob's post starts with 27 likes and liked=true
    expect(screen.getByText('27')).toBeTruthy();

    // Find the unlike button (Bob's post is already liked)
    const unlikeButton = screen.getByLabelText('Unlike post');
    fireEvent.press(unlikeButton);

    // Like count should decrease to 26
    expect(screen.getByText('26')).toBeTruthy();
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

  it('displays all three mock posts in the FlatList', () => {
    render(<FeedScreen />);

    // All three authors should be visible
    expect(screen.getByText('@alice')).toBeTruthy();
    expect(screen.getByText('@bob')).toBeTruthy();
    expect(screen.getByText('@carol')).toBeTruthy();
  });
});
