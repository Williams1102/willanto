import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImports from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import EslintPlugins from 'vite-plugin-eslint'
import Pages from 'vite-plugin-pages'

/* A configuration file for Vite. */
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.BASE,
    resolve: {
      alias: {
        '@/': `${resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [
      react(),
      Pages({
        dirs: [{ dir: 'src/pages', baseRoute: env.BASE || '' }],
        exclude: ['**/[A-Z]*.tsx'],
        importMode: 'async',
      }),
      AutoImports({
        imports: ['react', 'react-router-dom', 'recoil'],
        dts: 'src/configs/auto-imports.d.ts',
        resolvers: [],
        eslintrc: {
          enabled: true,
        },
      }),
      EslintPlugins(),
      visualizer(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-router-dom', 'react-dom'],
          },
        },
      },
    },
  }
})
