import { defineConfig } from 'vite';

// Relative base so the built bundle can be dropped into any sub-path of a
// static host (e.g. a /literature page on a personal GitHub Pages site).
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    assetsDir: 'assets',
  },
});
