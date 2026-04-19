import { createContextProvider, InjectionToken, type Signal } from '@viewfly/core'

export type VfuiTabsOrientation = 'horizontal' | 'vertical'

/** Tabs 通过 DI 下发给 TabList / Tab / TabPanel；内含 Signal，请在渲染中调用以建立订阅 */
export interface VfuiTabsContext {
  selected: Signal<string>
  select: (value: string) => void
  disabled: Signal<boolean>
  orientation: Signal<VfuiTabsOrientation>
  /** 用于 Tab / TabPanel 的 `id` 与 `aria-*` 互引用 */
  idPrefix: string
}

export const vfuiTabsToken = new InjectionToken<VfuiTabsContext>('VfuiTabs')

export const VfuiTabsProvider = createContextProvider({ provide: vfuiTabsToken })
