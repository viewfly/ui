import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ViewflyUIUtils',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {},
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
