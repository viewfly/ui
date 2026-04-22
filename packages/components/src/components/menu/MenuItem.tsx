import type { JSXNode } from '@viewfly/core'
import { IconGlyph } from '@viewfly/ui-icons'

export type MenuItemDensity = 'default' | 'compact'

export type MenuItemRole = 'option' | 'menuitem'

export type MenuItemHtmlType = 'button' | 'submit' | 'reset'

export interface MenuItemProps {
  children?: JSXNode
  /** 左侧图标，与文案同一行；多列菜单时占固定槽宽以便对齐 */
  icon?: JSXNode
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
      icon,
      selected = false,
      disabled = false,
      density = 'default',
      role = 'menuitem',
      class: extra,
      htmlType = 'button',
      chevronRight = false,
      onClick,
    } = props

    const hasIcon = icon != null
    const iconMod = hasIcon ? ' vfui-menu__item--with-icon' : ''
    const densityMod = density === 'compact' ? ' vfui-menu__item--compact' : ''
    const selectedMod = selected ? ' vfui-menu__item--selected' : ''
    const chevronMod = chevronRight ? ' vfui-menu__item--with-chevron' : ''
    const cls = `vfui-menu__item${iconMod}${densityMod}${selectedMod}${chevronMod}${extra ? ` ${extra}` : ''}`

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
            {hasIcon ? <span class="vfui-menu__item__icon">{icon}</span> : null}
            <span class="vfui-menu__item__main">{children}</span>
            <span class="vfui-menu__item__chevron" aria-hidden="true">
              <IconGlyph name="arrow-right" size={density === 'compact' ? 12 : 14} class="vfui-menu__item__chevron-icon" />
            </span>
          </>
        ) : hasIcon ? (
          <>
            <span class="vfui-menu__item__icon">{icon}</span>
            <span class="vfui-menu__item__text">{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
}
