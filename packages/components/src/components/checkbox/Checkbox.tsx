import type { JSXNode } from '@viewfly/core'
import { createSignal } from '@viewfly/core'
import './style.scss'

export interface CheckboxProps {
  /** 受控：是否勾选 */
  checked?: boolean
  /** 非受控初始状态 */
  defaultChecked?: boolean
  disabled?: boolean
  /** 状态变化 */
  onChange?: (checked: boolean) => void
  /** 文案，渲染在复选框右侧 */
  children?: JSXNode
  /** 透传到原生 input，便于 label 关联与表单 */
  id?: string
  name?: string
  /** 勾选时随表单提交的值 */
  value?: string
}

export function Checkbox(props: CheckboxProps) {
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

  const onNativeChange = (e: Event) => {
    if (props.disabled) return
    const el = e.target as HTMLInputElement
    commitChecked(el.checked)
  }

  return () => {
    const { disabled = false, children, id, name, value } = props
    const checked = resolveChecked()
    const disabledMod = disabled ? ' vfui-checkbox--disabled' : ''
    const checkedMod = checked ? ' vfui-checkbox--checked' : ''

    return (
      <label class={`vfui-checkbox${checkedMod}${disabledMod}`}>
        <input
          id={id}
          type="checkbox"
          class="vfui-checkbox__input"
          checked={checked}
          disabled={disabled}
          name={name}
          value={value}
          onChange={onNativeChange}
        />
        <span class="vfui-checkbox__box" aria-hidden="true">
          <svg class="vfui-checkbox__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3.5 8.2 6.2 11 12.5 4.5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        {children ? <span class="vfui-checkbox__label">{children}</span> : null}
      </label>
    )
  }
}
