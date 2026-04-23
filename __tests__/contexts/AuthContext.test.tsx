import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Mock supabase
const mockGetSession = jest.fn().mockResolvedValue({
  data: { session: null },
});
const mockOnAuthStateChange = jest.fn().mockReturnValue({
  data: { subscription: { unsubscribe: jest.fn() } },
});
const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();
const mockSignOut = jest.fn();

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => mockGetSession(),
      onAuthStateChange: (cb: Function) => mockOnAuthStateChange(cb),
      signInWithPassword: (args: unknown) => mockSignInWithPassword(args),
      signUp: (args: unknown) => mockSignUp(args),
      signOut: () => mockSignOut(),
    },
  },
}));

function AuthConsumer() {
  const { user, loading } = useAuth();
  return (
    <>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="user">{user ? user.id : 'none'}</Text>
    </>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ data: { session: null } });
  });

  it('provides loading=true initially then false after session check', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    // After getSession resolves, loading should be false
    await act(async () => {});
    expect(screen.getByTestId('loading').props.children).toBe('false');
  });

  it('provides user as null when no session', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await act(async () => {});
    expect(screen.getByTestId('user').props.children).toBe('none');
  });

  it('provides user when session exists', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user-123' },
          access_token: 'token',
          refresh_token: 'refresh',
        },
      },
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await act(async () => {});
    expect(screen.getByTestId('user').props.children).toBe('test-user-123');
  });

  it('throws when useAuth is used outside provider', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AuthConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider',
    );
    spy.mockRestore();
  });
});
