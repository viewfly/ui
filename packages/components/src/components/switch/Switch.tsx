import { createSignal } from '@viewfly/core'
import './style.scss'

export interface SwitchProps {
  /** 受控：是否打开 */
  checked?: boolean
  /** 非受控初始状态 */
  defaultChecked?: boolean
  disabled?: boolean
  /** 状态变化 */
  onChange?: (checked: boolean) => void
}

export function Switch(props: SwitchProps) {
  const uncontrolled = createSignal(props.defaultChecked ?? false)

  const resolveChecked = () => {
    if (props.checked !== undefined) {
      return props.checked
    }
    return uncontrolled()
  }

  const commitChecked = (next: boolean) => {
    const prev = resolveChecked()
    if (props.checked === undefined) {
      uncontrolled.set(next)
    }
    if (next !== prev) {
      props.onChange?.(next)
    }
  }

  const onClick = () => {
    if (props.disabled) return
    commitChecked(!resolveChecked())
  }

  return () => {
    const disabled = props.disabled ?? false
    const checked = resolveChecked()
    const disabledMod = disabled ? ' vfui-switch--disabled' : ''
    const checkedMod = checked ? ' vfui-switch--checked' : ''

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        class={`vfui-switch${checkedMod}${disabledMod}`}
        onClick={onClick}
      >
        <span class="vfui-switch__track" aria-hidden="true">
          <span class="vfui-switch__thumb" />
        </span>
      </button>
    )
  }
}
