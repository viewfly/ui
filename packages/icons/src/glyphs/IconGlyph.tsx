import type { IconProps } from '../icon-base'
import type { IconGlyphName } from './icon-names'

export type { IconGlyphName } from './icon-names'

export interface IconGlyphProps extends IconProps {
  /** 字形名称，见 `ICON_GLYPH_NAMES` / `ICON_PATHS` */
  name: IconGlyphName
}

/** 使用图标字体（`@font-face`）按名称显示字形 */
export function IconGlyph(props: IconGlyphProps) {
  return () => {
    const { name, size, class: className = '' } = props
    const iconClass = `vf-icon-${name}`
    const sizeCss =
      size === undefined
        ? undefined
        : typeof size === 'number'
          ? `${size}px`
          : size
    const style: Record<string, string> = {
      lineHeight: '1',
      display: 'inline-block',
      verticalAlign: 'middle',
    }
    if (sizeCss !== undefined) {
      style.fontSize = sizeCss
    }
    return (
      <span
        class={[iconClass, className].filter(Boolean).join(' ')}
        style={style}
        aria-hidden="true"
      />
    )
  }
}
