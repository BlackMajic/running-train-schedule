import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import ViteYaml from '@modyfi/vite-plugin-yaml';

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  base: '/running-train-schedule/',
  plugins: [
    devtools(),
    //nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
      }
    }),
    viteReact(),
    ViteYaml(),
  ],
})

export default config
