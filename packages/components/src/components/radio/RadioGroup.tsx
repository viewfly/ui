import type { JSXNode } from '@viewfly/core'
import { createDerived, createSignal } from '@viewfly/core'
import type { ButtonSize } from '../button/Button'
import type { VfuiRadioGroupContext, VfuiRadioGroupOptionType } from './context'
import { VfuiRadioGroupProvider } from './context'
import './style.scss'

export interface RadioGroupProps {
  /** 受控：当前选中的 `value` */
  value?: string
  /** 非受控初始选中项的 `value` */
  defaultValue?: string
  /** 选中项变化 */
  onChange?: (value: string) => void
  /** 原生 name，省略时自动生成 */
  name?: string
  disabled?: boolean
  /**
   * `button`：分段按钮形态（类似 antd `Radio.Group` 的 `optionType="button"`）。
   * 仅在组内 Radio 上生效。
   */
  optionType?: VfuiRadioGroupOptionType
  /**
   * 与 `Button` 的 `size` 一致；仅在 `optionType="button"` 时影响分段高度与字号。
   * @default 'middle'
   */
  size?: ButtonSize
  children?: JSXNode
  class?: string
}

export function RadioGroup(props: RadioGroupProps) {
  const fallbackName = `vfui-rg-${Math.random().toString(36).slice(2, 11)}`
  const uncontrolled = createSignal<string | undefined>(props.defaultValue)

  const selected = createDerived(() =>
    props.value !== undefined ? props.value : uncontrolled(),
  )

  const nameSig = createDerived(() => props.name ?? fallbackName)

  const disabledSig = createDerived(() => props.disabled ?? false)

  const optionTypeSig = createDerived(() => props.optionType ?? 'default')

  const select = (v: string) => {
    if (props.value === undefined) {
      uncontrolled.set(v)
    }
    props.onChange?.(v)
  }

  const ctx: VfuiRadioGroupContext = {
    name: nameSig,
    selected,
    select,
    disabled: disabledSig,
    optionType: optionTypeSig,
  }

  return () => {
    const { class: groupClass, children, size = 'middle' } = props
    const typeMod = optionTypeSig() === 'button' ? ' vfui-radio-group--button' : ''
    const sizeMod =
      optionTypeSig() === 'button' && size !== 'middle' ? ` vfui-radio-group--size-${size}` : ''
    const rootClass = groupClass
      ? `vfui-radio-group${typeMod}${sizeMod} ${groupClass}`
      : `vfui-radio-group${typeMod}${sizeMod}`

    return (
      <VfuiRadioGroupProvider useValue={ctx}>
        <div role="radiogroup" class={rootClass}>
          {children}
        </div>
      </VfuiRadioGroupProvider>
    )
  }
}
