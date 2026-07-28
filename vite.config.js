import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    // manualChunks only applies to the client build — during the SSR build
    // react/react-dom are external, so chunking them errors.
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router'],
              icons: ['lucide-react'],
            },
          },
        },
  },
}))
