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
  coveragePathIgnorePatterns: ['/dist/'],
  testPathIgnorePatterns: ['/dist/'],
  setupFiles: ['dotenv/config'],
}
