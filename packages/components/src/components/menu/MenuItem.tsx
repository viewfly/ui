import type { JSXNode } from '@viewfly/core'

export type MenuItemDensity = 'default' | 'compact'

export type MenuItemRole = 'option' | 'menuitem'

export type MenuItemHtmlType = 'button' | 'submit' | 'reset'

export interface MenuItemProps {
  children?: JSXNode
  selected?: boolean
  disabled?: boolean
  /** `compact`：更小的内边距与字号 */
  density?: MenuItemDensity
  /**
   * Select / listbox 传 `option`；
   * 普通下拉菜单传 `menuitem`（默认）。
   */
  role?: MenuItemRole
  class?: string
  htmlType?: MenuItemHtmlType
  onClick?: () => void
}

export function MenuItem(props: MenuItemProps) {
  return () => {
    const {
      children,
      selected = false,
      disabled = false,
      density = 'default',
      role = 'menuitem',
      class: extra,
      htmlType = 'button',
      onClick,
    } = props

    const densityMod = density === 'compact' ? ' vfui-menu__item--compact' : ''
    const selectedMod = selected ? ' vfui-menu__item--selected' : ''
    const cls = `vfui-menu__item${densityMod}${selectedMod}${extra ? ` ${extra}` : ''}`

    const ariaSelected = role === 'option' ? selected : undefined

    return (
      <button
        type={htmlType}
        class={cls}
        role={role}
        aria-selected={ariaSelected}
        disabled={disabled}
        onClick={() => {
          if (disabled) return
          onClick?.()
        }}
      >
        {children}
      </button>
    )
  }
}
