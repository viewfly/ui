import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import checker from 'vite-plugin-checker'

export default defineConfig({
  resolve: {
    alias: {
      '@viewfly/ui-utils': resolve(__dirname, '../utils/src/index.ts'),
      '@viewfly/ui-icons': resolve(__dirname, '../icons/src/index.ts'),
      '@viewfly/ui-components': resolve(__dirname, '../components/src/index.ts'),
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@viewfly/core',
  },
  plugins: [
    UnoCSS(),
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.json',
      },
    }),
  ],
})
