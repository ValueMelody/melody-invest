/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageReporters: [],
  collectCoverageFrom: [
    './client/**/*.{ts,tsx}',
    './server/**/*.{ts,tsx}',
    './constants/**/*.{ts,tsx}',
  ],
  setupFiles: ['dotenv/config'],
}
