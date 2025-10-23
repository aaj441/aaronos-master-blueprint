import { defineConfig } from '@tanstack/start/config'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  vite: {
    plugins: [
      TanStackRouterVite({
        routesDirectory: './app/routes',
        generatedRouteTree: './app/routeTree.gen.ts',
      }),
      viteTsConfigPaths(),
    ],
  },
  server: {
    preset: 'node-server',
    port: 8080,
  },
})
