import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@viewfly/core',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ViewflyUIIcons',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: (id) => id === '@viewfly/core' || id.startsWith('@viewfly/'),
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
