import type { JSXNode, ClassNames } from '@viewfly/core'
import type { StyleValue } from '@viewfly/platform-browser'

export interface MenuListProps {
  children?: JSXNode
  class?: ClassNames
  /**
   * 根节点内联样式；与 DOM `style` 一致（`StyleValue`：字符串、对象或 `null` 清除）。
   */
  style?: StyleValue
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
