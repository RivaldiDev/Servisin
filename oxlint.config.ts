import { defineConfig } from 'oxlint';

export default defineConfig({
  ignorePatterns: [
    '.agent/**',
    '.agents/**',
    '.claude/**',
    '.codex/**',
    '.gemini/**',
    'scripts/**',
    'tools/**',
    'dist/**',
    'client/dist/**',
    'server/dist/**',
    'node_modules/**',
  ],
});
