import type { CSSProperties, StyleValue } from '@viewfly/platform-browser'

export interface IconProps {
  /** 未传时与父级 `font-size` 一致（`IconGlyph` 不设置内联字号；`IconCheck` 为 `1em`） */
  size?: number | string
  /** 内联样式；颜色、描边等可写进对象（如 `color`、`stroke`），或配合 `class` 与 `currentColor` */
  style?: StyleValue
  class?: string
}

/** 合并库内置样式与 `style`（对象浅合并；`null` 视为不写内联样式） */
export function mergeIconStyle(
  base: CSSProperties,
  user: StyleValue | undefined
): string | CSSProperties | undefined {
  if (user === undefined) {
    return base
  }
  if (user === null) {
    return undefined
  }
  if (typeof user === 'string') {
    return user
  }
  return { ...base, ...user }
}
