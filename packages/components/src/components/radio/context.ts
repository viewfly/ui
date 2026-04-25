import { Computed, createContextProvider, InjectionToken } from '@viewfly/core'

export type VfuiRadioGroupOptionType = 'default' | 'button'

/** RadioGroup 通过 DI 下发给 Radio；内含 Signal，请在渲染中调用以建立订阅 */
export interface VfuiRadioGroupContext {
  name: Computed<string>
  selected: Computed<string | undefined>
  select: (value: string) => void
  disabled: Computed<boolean>
  optionType: Computed<VfuiRadioGroupOptionType>
}

export const VfuiRadioGroupToken = new InjectionToken<VfuiRadioGroupContext>('VfuiRadioGroup')

export const VfuiRadioGroupProvider = createContextProvider({ provide: VfuiRadioGroupToken })
