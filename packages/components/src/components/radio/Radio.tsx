import type { JSXNode } from '@viewfly/core'
import { createSignal, inject } from '@viewfly/core'
import { vfuiRadioGroupToken } from './context'
import './style.scss'

export interface RadioProps {
  /** 受控：是否选中（在 RadioGroup 内无效，由组状态决定） */
  checked?: boolean
  /** 非受控初始选中（在 RadioGroup 内无效） */
  defaultChecked?: boolean
  disabled?: boolean
  /** 选中当前项时触发，参数为当前 `value`（在 RadioGroup 内无效，请使用 RadioGroup 的 onChange） */
  onChange?: (value: string) => void
  children?: JSXNode
  id?: string
  /** 同组互斥；在 RadioGroup 内由组提供 name */
  name?: string
  /** 组内取值；在 RadioGroup 内必填语义，默认 `on` */
  value?: string
}

export function Radio(props: RadioProps) {
  const group = inject(vfuiRadioGroupToken, null)
  const uncontrolled = createSignal(props.defaultChecked ?? false)

  const resolveChecked = () => {
    if (props.checked !== undefined) {
      return props.checked
    }
    return uncontrolled()
  }

  const onNativeChange = (e: Event) => {
    const el = e.target as HTMLInputElement
    if (!el.checked) return

    if (group) {
      const disabled = group.disabled() || (props.disabled ?? false)
      if (disabled) return
      group.select(props.value ?? 'on')
      return
    }

    if (props.disabled) return

    const controlledMode = props.checked !== undefined
    const nativeGroupUncontrolled = !controlledMode && props.name !== undefined

    if (!controlledMode && !nativeGroupUncontrolled) {
      uncontrolled.set(true)
    }

    props.onChange?.(props.value ?? 'on')
  }

  return () => {
    const { disabled: propDisabled = false, children, id, name, value = 'on' } = props

    if (group) {
      const disabled = group.disabled() || propDisabled
      const checkedAttr = group.selected() === value
      const disabledMod = disabled ? ' vfui-radio--disabled' : ''

      return (
        <label class={`vfui-radio${disabledMod}`}>
          <input
            id={id}
            type="radio"
            class="vfui-radio__input"
            checked={checkedAttr}
            disabled={disabled}
            name={group.name()}
            value={value}
            onChange={onNativeChange}
          />
          <span class="vfui-radio__box" aria-hidden="true">
            <span class="vfui-radio__dot" />
          </span>
          {children ? <span class="vfui-radio__label">{children}</span> : null}
        </label>
      )
    }

    const controlledMode = props.checked !== undefined
    const nativeGroupUncontrolled = !controlledMode && name !== undefined

    let checkedAttr: boolean | undefined
    let defaultCheckedAttr: boolean | undefined
    if (controlledMode) {
      checkedAttr = props.checked
      defaultCheckedAttr = undefined
    } else if (nativeGroupUncontrolled) {
      checkedAttr = undefined
      defaultCheckedAttr = props.defaultChecked ? true : undefined
    } else {
      checkedAttr = resolveChecked()
      defaultCheckedAttr = undefined
    }

    const disabledMod = propDisabled ? ' vfui-radio--disabled' : ''

    return (
      <label class={`vfui-radio${disabledMod}`}>
        <input
          id={id}
          type="radio"
          class="vfui-radio__input"
          checked={checkedAttr}
          defaultChecked={defaultCheckedAttr}
          disabled={propDisabled}
          name={name}
          value={value}
          onChange={onNativeChange}
        />
        <span class="vfui-radio__box" aria-hidden="true">
          <span class="vfui-radio__dot" />
        </span>
        {children ? <span class="vfui-radio__label">{children}</span> : null}
      </label>
    )
  }
}
