const PREFIX = 'vfui.colorPicker.recent.v1:'

const MAX = 7

function keyFor(name: string) {
  return `${PREFIX}${encodeURIComponent(name)}`
}

/**
 * 按名称读取最近使用颜色；无数据或非法时返回 `null`。
 */
export function readRecentColorsCache(name: string): string[] | null {
  if (typeof localStorage === 'undefined') {
    return null
  }
  try {
    const raw = localStorage.getItem(keyFor(name))
    if (raw == null) {
      return null
    }
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) {
      return null
    }
    const list = data.filter((x): x is string => typeof x === 'string' && x.length > 0)
    if (list.length === 0) {
      return null
    }
    return list.slice(0, MAX)
  } catch {
    return null
  }
}

/**
 * 写入最近使用颜色（自动截断为 MAX 条）。
 */
export function writeRecentColorsCache(name: string, colors: string[]) {
  if (typeof localStorage === 'undefined') {
    return
  }
  try {
    const list = colors.filter(x => typeof x === 'string' && x.length > 0).slice(0, MAX)
    localStorage.setItem(keyFor(name), JSON.stringify(list))
  } catch {
    // 忽略配额、隐私模式等
  }
}

/**
 * 初始列表：有 `name` 时优先用缓存，否则/缓存为空时用 `recentColors` prop。
 */
export function resolveInitialRecentColors(
  name: string | undefined,
  recentColorsProp: string[] | undefined
): string[] {
  if (name) {
    const cached = readRecentColorsCache(name)
    if (cached != null && cached.length > 0) {
      return cached
    }
  }
  return recentColorsProp ?? []
}
