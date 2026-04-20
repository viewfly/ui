import type { JSXNode } from '@viewfly/core'
import { IconArrowRight } from '@viewfly/ui-icons'

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
  /** 为 true 时在右侧展示子菜单式右箭头（与 `Dropdown` 内嵌套项一致） */
  chevronRight?: boolean
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
      chevronRight = false,
      onClick,
    } = props

    const densityMod = density === 'compact' ? ' vfui-menu__item--compact' : ''
    const selectedMod = selected ? ' vfui-menu__item--selected' : ''
    const chevronMod = chevronRight ? ' vfui-menu__item--with-chevron' : ''
    const cls = `vfui-menu__item${densityMod}${selectedMod}${chevronMod}${extra ? ` ${extra}` : ''}`

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
        {chevronRight ? (
          <>
            <span class="vfui-menu__item__main">{children}</span>
            <span class="vfui-menu__item__chevron" aria-hidden="true">
              <IconArrowRight size={density === 'compact' ? 12 : 14} class="vfui-menu__item__chevron-icon" />
            </span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
}
