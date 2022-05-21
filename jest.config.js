/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageReporters: ['text'],
  collectCoverageFrom: [
    './client/**/*.{ts,tsx}',
    './server/**/*.{ts,tsx}',
    './constants/**/*.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coveragePathIgnorePatterns: ['/dist/'],
  testPathIgnorePatterns: ['/dist/'],
  setupFiles: ['dotenv/config'],
}
