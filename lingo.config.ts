import { defineConfig } from '@lingo-dev/cli';

export default defineConfig({
  baseLocale: 'fr',
  locales: ['fr', 'en'],
  translationFiles: {
    pattern: 'locales/{{locale}}.json',
  },
});