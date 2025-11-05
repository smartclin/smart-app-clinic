import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths() // ✅ Uses paths from tsconfig.json (no need for manual alias)
    ],
    test: {
        globals: true,
        environment: 'jsdom', // ✅ Needed for testing React components
        setupFiles: ['./src/tests/setup.ts'], // e.g. extend matchers, mock fetch, etc.
        include: ['src/**/*.{test,spec}.{ts,tsx}'], // ✅ Simpler and broader
        exclude: [
            '**/node_modules/**',
            '**/e2e/**',
            '**/dist/**',
            '**/coverage/**',
            '**/.next/**' // ✅ Ignore Next.js build output
        ],
        mockReset: true, // ✅ Resets mocks between tests for isolation
        clearMocks: true, // ✅ Automatically clears mocks
        restoreMocks: true, // ✅ Restores originals after tests
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: './coverage',
            exclude: [
                ...coverageConfigDefaults.exclude,
                '**/tests/**',
                '**/*.d.ts',
                '**/mocks/**',
                '**/__mocks__/**',
                '**/node_modules/**',
                '**/vite.config.*',
                '**/vitest.config.*',
                '**/.next/**'
            ]
        }
    }
});
