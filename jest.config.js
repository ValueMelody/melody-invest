/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: [],
  collectCoverageFrom: ['./client/**/*.{ts,tsx}', './server/**/*.{ts,tsx}'],
}
