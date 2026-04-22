export interface IconProps {
  /** 未传时与父级 `font-size` 一致（`IconGlyph` 不设置内联字号；`IconCheck` 为 `1em`） */
  size?: number | string
  color?: string
  class?: string
}
