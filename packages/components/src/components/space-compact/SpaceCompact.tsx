import type { JSXNode } from '@viewfly/core'
import './style.scss'

export interface SpaceCompactProps {
  children?: JSXNode
  /** 追加到根容器 */
  class?: string
  /** 占满父级宽度（`width: 100%`） */
  block?: boolean
}

/** 子级横向紧凑拼接，用于按钮 + 下拉触发器等组合（对齐 Ant Design `Space.Compact`） */
export function SpaceCompact(props: SpaceCompactProps) {
  return () => {
    const { children, class: extra, block = false } = props
    const blockMod = block ? ' vfui-space-compact--block' : ''
    const cls = `vfui-space-compact${blockMod}${extra ? ` ${extra}` : ''}`
    return <div class={cls}>{children}</div>
  }
}
