import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { createLibExternal } from '../../internal/vite-lib-external'

const packageDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    minify: false,
    cssMinify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ViewflyUIUtils',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: createLibExternal(packageDir),
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json',
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
})
