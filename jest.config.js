module.exports = {
    roots: ['<rootDir>/tests/'],
    verbose: true,
    clearMocks: true,
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'node',
    testMatch: ['**/*.test.(ts|js)', '**/__tests__/**/?(*.)+(spec|test).ts'],
    testRunner: 'jest-circus/runner',
    testPathIgnorePatterns: ['/node_modules/', '<rootDir>/templates/', '/__fixtures__/'],
    transform: {
        '^.+\\.(js|ts)$': 'ts-jest',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.(ts|js)',
        '**/*.js',
        '!**/*.d.ts',
        '!**/dist/**',
        '!**/node_modules/**',
        '!**/vendor/**',
        '!**/generated/**',
        '!**/__fixtures__/**',
        '!**/scenarios/**',
        '!**/redirects/**',
    ],
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0,
        },
    },
    coverageDirectory: './coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
}
