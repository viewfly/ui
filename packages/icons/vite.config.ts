import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { createLibExternal } from '../../internal/vite-lib-external'

const packageDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@viewfly/core',
  },
  build: {
    minify: false,
    cssMinify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ViewflyUIIcons',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: createLibExternal(packageDir),
    },
    sourcemap: true,
  },
  plugins: [
    libInjectCss(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
})
