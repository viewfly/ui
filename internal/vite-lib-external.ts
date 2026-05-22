import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function collectPackageDeps(packageDir: string): Set<string> {
  const pkg = JSON.parse(
    readFileSync(resolve(packageDir, 'package.json'), 'utf-8'),
  ) as {
    dependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
    optionalDependencies?: Record<string, string>
  }

  return new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
  ])
}

/** 库模式构建：不打包 package.json 中的 dependencies / peerDependencies */
export function createLibExternal(packageDir: string) {
  const deps = collectPackageDeps(packageDir)

  return (id: string): boolean => {
    for (const dep of deps) {
      if (id === dep || id.startsWith(`${dep}/`)) {
        return true
      }
    }
    return false
  }
}
