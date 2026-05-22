import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'
import swc from 'vite-plugin-swc-transform'
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
      name: 'ViewflyUIComponents',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: createLibExternal(packageDir),
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
  plugins: [
    UnoCSS(),
    swc({
      swcOptions: {
        jsc: {
          target: 'es2020',
          externalHelpers: false,
          parser: {
            syntax: 'typescript',
            decorators: true,
            tsx: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
            useDefineForClassFields: false,
            react: {
              runtime: 'automatic',
              importSource: '@viewfly/core',
              throwIfNamespace: true,
            },
          },
        },
      }
    }),
    dts({
      tsconfigPath: './tsconfig.build.json',
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
})
