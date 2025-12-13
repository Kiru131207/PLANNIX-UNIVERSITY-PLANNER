import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
  // Use '.' instead of process.cwd() to avoid type errors and ensure correct path resolution
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      // Ensure manifest and service worker are copied to the dist folder
      viteStaticCopy({
        targets: [
          { src: 'manifest.json', dest: '.' },
          { src: 'sw.js', dest: '.' }
        ]
      })
    ],
    // Polyfill process.env.API_KEY so existing code works without modification
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false
    }
  };
});