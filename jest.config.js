export default {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/?(*.)+(test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  setupFiles: ['<rootDir>/src/tests/setup-env.js'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testTimeout: 30 * 1000
};
