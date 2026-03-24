module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'features/scoring/**/*.{ts,tsx}',
    'utils/activity.ts',
    '!**/*.d.ts',
    '!**/index.ts',
  ],
  coverageDirectory: 'tests/reports/coverage',
};
