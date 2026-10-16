export default {
  testEnvironment: 'node',
  clearMocks: true,
  transform: {},
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'json'],
  setupFiles: ['<rootDir>/tests/setup-env.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/Migrations/helpers\\.js$',
    '/tests/Migrations/manifest\\.js$',
    '/tests/setup-env\\.js$',
  ],
  maxWorkers: 1,   // ← serial execution
};