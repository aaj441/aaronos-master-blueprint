import { defineConfig } from 'vinxi';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    preset: 'node',
    experimental: {
      asyncContext: true,
    },
  },
  routers: [
    {
      name: 'public',
      type: 'static',
      dir: './public',
      base: '/',
    },
    {
      name: 'ssr',
      type: 'http',
      handler: './src/entry-server.tsx',
      target: 'server',
      plugins: () => [
        TanStackRouterVite({
          autoCodeSplitting: true,
        }),
        react(),
      ],
    },
    {
      name: 'client',
      type: 'client',
      handler: './src/entry-client.tsx',
      target: 'browser',
      plugins: () => [
        TanStackRouterVite({
          autoCodeSplitting: true,
        }),
        react(),
      ],
      base: '/_build',
    },
    {
      name: 'api',
      type: 'http',
      base: '/api',
      handler: './src/server/api.ts',
      target: 'server',
    },
  ],
});
