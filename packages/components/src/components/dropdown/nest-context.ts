import { createContextProvider, InjectionToken } from '@viewfly/core'

/**
 * 父级 Dropdown 在面板内提供，供子级注册其 Portal 面板节点，
 * 以便父级在「点击外部关闭」与「悬停关闭」时把子菜单视为菜单树的一部分。
 */
export interface VfuiDropdownNestContext {
  registerNestedPanel: (el: HTMLElement | null) => () => void
  /** 指针进入子菜单浮层时取消父级的悬停关闭计时 */
  onNestedPanelEnter: () => void
}

export const VfuiDropdownNestToken = new InjectionToken<VfuiDropdownNestContext>('VfuiDropdownNest')

export const VfuiDropdownNestProvider = createContextProvider({ provide: VfuiDropdownNestToken })
