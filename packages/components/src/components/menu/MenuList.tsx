import type { JSXNode } from '@viewfly/core'

export interface MenuListProps {
  children?: JSXNode
  class?: string
  /** Select 等 listbox 容器 */
  role?: 'listbox' | 'menu'
  id?: string
  /** 列紧凑布局：减少菜单容器内边距与项间距 */
  columnCompact?: boolean
}

export function MenuList(props: MenuListProps) {
  return () => {
    const { children, class: extra, role, id, columnCompact = false } = props
    const compactMod = columnCompact ? ' vfui-menu--column-compact' : ''
    const cls = `vfui-menu${compactMod}${extra ? ` ${extra}` : ''}`
    return (
      <div class={cls} role={role} id={id}>
        {children}
      </div>
    )
  }
}
