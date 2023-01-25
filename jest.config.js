module.exports = {
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.(ts|tsx)$': ['@swc/jest', {
          jsc: {
            baseUrl: './src',
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        }],
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
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': ['@swc/jest', {
          jsc: {
            baseUrl: './',
          },
        }],
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
      testMatch: [
        '<rootDir>/server/**/*.test.ts',
      ],
    },
    {
      displayName: 'constants',
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': ['@swc/jest'],
      },
      testMatch: ['<rootDir>/constants/**/*.test.ts'],
    },
    {
      displayName: 'helpers',
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': ['@swc/jest'],
      },
      testMatch: ['<rootDir>/helpers/**/*.test.ts'],
    },
  ],
  coverageReporters: ['text'],
  collectCoverageFrom: [
    './client/**/*.{ts,tsx}',
    './server/**/*.ts',
    './constants/**/*.ts',
    './helpers/**/*.ts',
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
