import type { JSXNode } from '@viewfly/core'
import type { ClassNames } from '@viewfly/core'

export interface MenuListProps {
  children?: JSXNode
  class?: ClassNames
  /**
   * 根节点内联样式；传对象时使用与 DOM 一致的 camelCase（如 `width`、`minWidth`、`maxHeight`）。
   * 亦可传行内 CSS 字符串。
   */
  style?: string | Record<string, string>
  /** Select 等 listbox 容器 */
  role?: 'listbox' | 'menu'
  id?: string
  /** 列紧凑布局：减少菜单容器内边距与项间距 */
  columnCompact?: boolean
}

export function MenuList(props: MenuListProps) {
  return () => {
    const { children, class: extra, role, id, columnCompact = false, style } = props
    const compactMod = columnCompact ? ' vfui-menu--column-compact' : ''
    const baseCls = `vfui-menu${compactMod}`
    return (
      <div class={[baseCls, extra]} role={role} id={id} style={style}>
        {children}
      </div>
    )
  }
}
