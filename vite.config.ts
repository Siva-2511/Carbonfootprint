import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react')) return 'react';
          if (id.includes('node_modules/chart.js')) return 'charts';
          if (id.includes('node_modules/zustand')) return 'store';
        },
      },
    },
  },
});
