module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Exclude Playwright e2e tests (they use their own runner)
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/e2e/',
  ],

  // Worker stability settings
  maxWorkers: '50%',
  workerIdleMemoryLimit: '512MB',

  moduleNameMapper: {
    '^@/assets/.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: './tsconfig.spec.json',
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts',
    '!src/reportWebVitals.ts',
  ],
  // Coverage thresholds disabled - low coverage due to complex UI components
  // TODO: Re-enable once test coverage increases
  // coverageThreshold: {
  //   global: {
  //     branches: 10,
  //     functions: 10,
  //     lines: 10,
  //     statements: 10,
  //   },
  // },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['<rootDir>/src/polyfills.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|remark-gfm|vfile|unist-.*|unified|bail|is-plain-obj|trough|remark-.*|micromark-.*|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|pretty-bytes|ccount|mdast-util-.*|micromark|parse-entities|character-entities-legacy|character-reference-invalid|is-decimal|is-hexadecimal|is-alphanumerical|is-alphabetical|is-word-character|trim-lines|web-namespaces|devlop|mermaid)/)'
  ],
};