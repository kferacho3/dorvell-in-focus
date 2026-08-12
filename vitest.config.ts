import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const alias = {
  '@': fileURLToPath(new URL('.', import.meta.url)),
  '@payload-config': fileURLToPath(new URL('./payload.config.ts', import.meta.url)),
}

/**
 * Two projects, because the suites have genuinely different needs.
 *
 * Unit tests run in jsdom and must stay fast — they are the ones run on every
 * save. Integration tests boot Payload against a real Postgres database, which
 * needs the node environment (jsdom breaks the pg driver) and a longer timeout
 * for the first connection.
 *
 * They also point at a *separate* database. Running them against the
 * development database would delete a developer's seeded content partway
 * through a session, which is the kind of thing that teaches people not to run
 * the tests.
 */
export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  test: {
    projects: [
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./tests/setup.ts'],
          include: ['tests/unit/**/*.test.{ts,tsx}'],
        },
      },
      {
        resolve: { alias },
        test: {
          name: 'integration',
          environment: 'node',
          globals: true,
          setupFiles: ['./tests/integration/setup.ts'],
          include: ['tests/integration/**/*.test.ts'],
          testTimeout: 30_000,
          hookTimeout: 60_000,
        },
      },
    ],
    // Payload holds a connection pool, and parallel integration files would
    // exhaust it and produce failures that look like logic bugs. This is a
    // root-level option; Vitest rejects it inside a project config.
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['lib/**', 'payload/**', 'components/**'],
      exclude: ['**/*.d.ts', '**/index.ts'],
    },
  },
})
