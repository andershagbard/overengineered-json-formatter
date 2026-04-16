import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'test',
  plugins: [tailwindcss(), react()],
  resolve: { tsconfigPaths: true },
});
