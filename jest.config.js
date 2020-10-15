module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  globals: {
    'ts-jest': {
      tsConfig: 'test/tsconfig.json',
      diagnostics: {
        ignoreCodes: [151001],
      },
    },
  },
  moduleDirectories: ['node_modules', 'src', './'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  setupFiles: ['<rootDir>/test/__setup__/setupFiles.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/__setup__/setupTests.ts'],
  testRegex: '/.*?\\.(test|spec)\\.tsx?$',
  transform: { '.*': 'ts-jest' },
  verbose: false,
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
