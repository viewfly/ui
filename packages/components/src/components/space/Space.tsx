import type { JSXNode } from '@viewfly/core'
import type { ClassNames } from '@viewfly/core'
import { SpaceCompact } from '../space-compact/SpaceCompact'
import './style.scss'

export type SpaceDirection = 'horizontal' | 'vertical'

/** 交叉轴对齐（横向时为纵向对齐，纵向时为横向对齐） */
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch'

/** 预设间距或自定义像素；元组时为 `[列间距, 行间距]`（换行时有用） */
export type SpaceSize = 'small' | 'middle' | 'large' | number | readonly [number, number]

export interface SpaceProps {
  /** 排列方向 */
  direction?: SpaceDirection
  /** 子项间距 */
  size?: SpaceSize
  /** 交叉轴对齐 */
  align?: SpaceAlign
  /** 是否换行（仅横向时常见） */
  wrap?: boolean
  /** 插在相邻子项之间的分隔节点 */
  split?: JSXNode
  /** 占满父级宽度 */
  block?: boolean
  class?: ClassNames
  children?: JSXNode
}

function flattenChildren(node: JSXNode | undefined): JSXNode[] {
  if (node == null || node === false || node === true) return []
  if (Array.isArray(node)) {
    return node.flatMap((c) => flattenChildren(c as JSXNode))
  }
  return [node]
}

function gapStyle(size: SpaceSize | undefined): Record<string, string> | undefined {
  if (size == null) return undefined
  if (typeof size === 'number') return { gap: `${size}px` }
  if (Array.isArray(size)) {
    return { columnGap: `${size[0]}px`, rowGap: `${size[1]}px` }
  }
  return undefined
}

function gapClassForPreset(size: SpaceSize | undefined): string {
  if (size == null || typeof size === 'number' || Array.isArray(size)) return ''
  if (size === 'small') return ' vfui-space--gap-small'
  if (size === 'large') return ' vfui-space--gap-large'
  return ' vfui-space--gap-middle'
}

function SpaceRoot(props: SpaceProps) {
  return () => {
    const {
      direction = 'horizontal',
      size = 'middle',
      align = 'center',
      wrap = false,
      split,
      block = false,
      class: extra,
      children,
    } = props

    const dirMod = direction === 'vertical' ? ' vfui-space--vertical' : ''
    const wrapMod = wrap ? ' vfui-space--wrap' : ''
    const blockMod = block ? ' vfui-space--block' : ''
    const alignMod = ` vfui-space--align-${align}`
    const gapMod = gapClassForPreset(size)
    const cls = `vfui-space${dirMod}${wrapMod}${blockMod}${alignMod}${gapMod}`
    const style = gapStyle(
      typeof size === 'number' || Array.isArray(size) ? size : undefined,
    )

    const items = flattenChildren(children)
    const nodes: JSXNode[] = []
    for (let i = 0; i < items.length; i++) {
      if (i > 0 && split != null) {
        nodes.push(
          <span class="vfui-space__split" aria-hidden="true">
            {split}
          </span>,
        )
      }
      nodes.push(items[i]!)
    }

    return (
      <div class={[cls, extra]} style={style}>
        {nodes}
      </div>
    )
  }
}

/** 子项均匀间距布局；`Space.Compact` 与 Ant Design `Space.Compact` 一致（同 `SpaceCompact`） */
export const Space = Object.assign(SpaceRoot, { Compact: SpaceCompact })
