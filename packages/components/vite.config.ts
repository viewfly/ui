import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@viewfly/core',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ViewflyUIComponents',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: (id) => id === '@viewfly/core' || id.startsWith('@viewfly/'),
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
  plugins: [
    UnoCSS(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
})
