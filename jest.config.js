module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterSetup: ['@testing-library/jest-native/extend-expect'],
  testPathPattern: ['<rootDir>/__tests__/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
