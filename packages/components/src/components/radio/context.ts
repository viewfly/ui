import { createContextProvider, InjectionToken, type Signal } from '@viewfly/core'

export type VfuiRadioGroupOptionType = 'default' | 'button'

/** RadioGroup 通过 DI 下发给 Radio；内含 Signal，请在渲染中调用以建立订阅 */
export interface VfuiRadioGroupContext {
  name: Signal<string>
  selected: Signal<string | undefined>
  select: (value: string) => void
  disabled: Signal<boolean>
  optionType: Signal<VfuiRadioGroupOptionType>
}

export const vfuiRadioGroupToken = new InjectionToken<VfuiRadioGroupContext>('VfuiRadioGroup')

export const VfuiRadioGroupProvider = createContextProvider({ provide: vfuiRadioGroupToken })
