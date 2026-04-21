import type { JSXNode } from '@viewfly/core'
import './style.scss'

export type DividerDirection = 'horizontal' | 'vertical'

/** 水平且带 `children` 时，文案相对两侧线段的位置 */
export type DividerTextAlign = 'start' | 'center' | 'end'
export type DividerSpacing = 'default' | 'compact' | 'none'

export interface DividerProps {
  direction?: DividerDirection
  dashed?: boolean
  /** 水平时减少上下外边距 */
  plain?: boolean
  /** 分割线与前后内容的间距 */
  spacing?: DividerSpacing
  textAlign?: DividerTextAlign
  children?: JSXNode
}

export function Divider(props: DividerProps) {
  return () => {
    const {
      direction = 'horizontal',
      dashed = false,
      plain = false,
      spacing,
      textAlign = 'center',
      children,
    } = props

    const dashedMod = dashed ? ' vfui-divider--dashed' : ''
    const plainMod = plain ? ' vfui-divider--plain' : ''
    const resolvedSpacing = spacing ?? (plain ? 'compact' : 'default')
    const spacingMod = ` vfui-divider--spacing-${resolvedSpacing}`

    if (direction === 'vertical') {
      return (
        <div
          class={`vfui-divider vfui-divider--vertical${dashedMod}${plainMod}${spacingMod}`}
          role="separator"
          aria-orientation="vertical"
        />
      )
    }

    const hasText = children != null
    const textMod = hasText ? ` vfui-divider--with-text vfui-divider--text-${textAlign}` : ''

    if (!hasText) {
      return (
        <div
          class={`vfui-divider vfui-divider--horizontal${dashedMod}${plainMod}${spacingMod}`}
          role="separator"
          aria-orientation="horizontal"
        />
      )
    }

    return (
      <div
        class={`vfui-divider vfui-divider--horizontal${dashedMod}${plainMod}${textMod}${spacingMod}`}
        role="separator"
        aria-orientation="horizontal"
      >
        <span class="vfui-divider__text">{children}</span>
      </div>
    )
  }
}
