import { renderHook } from '@testing-library/react-native';

// Keep a reference to swap the mock return value between tests
let mockColorScheme: 'light' | 'dark' | null = null;

jest.mock('react-native', () => {
  const actual = jest.requireActual('react-native');
  return {
    ...actual,
    useColorScheme: () => mockColorScheme,
  };
});

// Import AFTER mock is in place
import { useColorScheme } from '../../hooks/useColorScheme';

describe('useColorScheme', () => {
  it('returns "light" when system scheme is null', () => {
    mockColorScheme = null;
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('light');
  });

  it('returns "light" when system scheme is light', () => {
    mockColorScheme = 'light';
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('light');
  });

  it('returns "dark" when system scheme is dark', () => {
    mockColorScheme = 'dark';
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('dark');
  });
});
