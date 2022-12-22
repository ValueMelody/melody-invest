/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  projects: [
    {
      displayName: 'client',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      globals: {
        'ts-jest': {
          tsconfig: '<rootDir>/client/tsconfig.json',
        },
      },
      moduleDirectories: [
        '<rootDir>/node_modules',
        '<rootDir>/client/node_modules',
        '<rootDir>/client/src',
      ],
      setupFiles: [
        'dotenv/config',
        '<rootDir>/scripts/mocks/adapters/storageMock',
      ],
      testMatch: ['<rootDir>/client/**/*.test.{ts,tsx}'],
      coveragePathIgnorePatterns: ['/dist/'],
      testPathIgnorePatterns: ['/dist/'],
    },
    {
      displayName: 'server',
      preset: 'ts-jest',
      testEnvironment: 'node',
      globals: {
        'ts-jest': {
          tsconfig: '<rootDir>/server/tsconfig.json',
        },
      },
      moduleDirectories: [
        '<rootDir>/node_modules',
        '<rootDir>/server/node_modules',
        '<rootDir>/server',
      ],
      setupFiles: [
        'dotenv/config',
        '<rootDir>/scripts/mocks/adapters/cacheMock',
        '<rootDir>/scripts/mocks/adapters/databaseMock',
      ],
      testMatch: ['<rootDir>/server/**/*.test.ts'],
      coveragePathIgnorePatterns: ['/dist/'],
      testPathIgnorePatterns: ['/dist/'],
    },
    {
      displayName: 'constants',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/constants/**/*.test.ts'],
      coveragePathIgnorePatterns: ['/dist/'],
      testPathIgnorePatterns: ['/dist/'],
    },
  ],
  coverageReporters: ['text'],
  collectCoverageFrom: [
    './client/**/*.{ts,tsx}',
    './server/**/*.ts',
    './constants/**/*.ts',
    '!./**/*.test.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
