import { createContextProvider, InjectionToken, type Signal } from '@viewfly/core'

/** 供 `Dropdown` 触发区子树消费：展开态与下拉触发器标识 */
export interface VfuiDropdownTriggerContext {
  expanded: Signal<boolean>
}

export const VfuiDropdownTriggerToken = new InjectionToken<VfuiDropdownTriggerContext>('VfuiDropdownTrigger')

export const VfuiDropdownTriggerProvider = createContextProvider({ provide: VfuiDropdownTriggerToken })
