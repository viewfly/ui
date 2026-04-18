import type { JSXNode } from '@viewfly/core'
import { createDerived, createSignal } from '@viewfly/core'
import type { VfuiRadioGroupContext } from './context'
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
  }

  return () => {
    const { class: groupClass, children } = props
    const rootClass = groupClass ? `vfui-radio-group ${groupClass}` : 'vfui-radio-group'

    return (
      <VfuiRadioGroupProvider useValue={ctx}>
        <div role="radiogroup" class={rootClass}>
          {children}
        </div>
      </VfuiRadioGroupProvider>
    )
  }
}
