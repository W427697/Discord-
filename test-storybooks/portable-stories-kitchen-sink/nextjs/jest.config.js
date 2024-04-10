const nextJest = require('next/jest.js');
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: __dirname,
})
 
/** @type {import('jest').Config} */
const customJestConfig = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['./jest.setup.ts'],
  // TODO add docs about this: alias next/headers to @storybook/nextjs/headers
  moduleNameMapper: {
    '^next/headers$': '@storybook/nextjs/headers.mock',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)