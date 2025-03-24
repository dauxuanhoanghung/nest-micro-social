import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  verbose: true,
  rootDir: '.', // Changed to root directory since test/ is at root level
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.dto.ts', // Optional: exclude DTOs from coverage
    '!src/**/*.module.ts', // Optional: exclude modules from coverage
    '!src/main.ts', // Optional: exclude main.ts from coverage
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['<rootDir>/test/**/*.spec.ts'], // Look specifically in test/ folder
};

export default config;
