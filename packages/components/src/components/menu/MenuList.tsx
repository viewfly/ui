import type { JSXNode } from '@viewfly/core'

export interface MenuListProps {
  children?: JSXNode
  class?: string
  /** Select 等 listbox 容器 */
  role?: 'listbox' | 'menu'
  id?: string
}

export function MenuList(props: MenuListProps) {
  return () => {
    const { children, class: extra, role, id } = props
    const cls = `vfui-menu${extra ? ` ${extra}` : ''}`
    return (
      <div class={cls} role={role} id={id}>
        {children}
      </div>
    )
  }
}
