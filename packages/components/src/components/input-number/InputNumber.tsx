import type { JSXNode } from '@viewfly/core'
import { createDerived, createSignal } from '@viewfly/core'
import type { InputSize } from '../input/Input'
import '../input/style.scss'
import './style.scss'

function clamp(n: number, min?: number, max?: number): number {
  let x = n
  if (min != null && Number.isFinite(min)) x = Math.max(x, min)
  if (max != null && Number.isFinite(max)) x = Math.min(x, max)
  return x
}

function roundToPrecision(n: number, precision?: number): number {
  if (precision == null || precision < 0) return n
  const f = 10 ** precision
  return Math.round(n * f) / f
}

function parseNumericInput(s: string): number | null {
  const t = s.trim().replace(/,/g, '')
  if (t === '' || t === '-' || t === '+' || t === '.' || t === '-.' || t === '+.') return null
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}

function formatDisplay(n: number | null | undefined, precision?: number): string {
  if (n == null || Number.isNaN(n)) return ''
  if (precision != null && precision >= 0) return n.toFixed(precision)
  return String(n)
}

export type InputNumberControlsLayout = 'split' | 'stack'

export interface InputNumberProps {
  /** 受控数值；`undefined` 表示由非受控或空串处理 */
  value?: number | null
  /** 非受控初始值 */
  defaultValue?: number | null
  /** 数值变化（含清空为 `null`） */
  onChange?: (value: number | null) => void
  onFocus?: (e: FocusEvent) => void
  onBlur?: (e: FocusEvent) => void
  onKeydown?: (e: KeyboardEvent) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  size?: InputSize
  block?: boolean
  class?: string
  prefix?: JSXNode
  suffix?: JSXNode
  /** 是否展示减号 / 加号步进按钮，默认 `true` */
  controls?: boolean
  /**
   * 步进按钮布局：`split` 为输入框两侧各一颗（默认）；`stack` 为两颗均在输入框右侧纵向排列，适合横向空间较紧的场景。
   */
  controlsLayout?: InputNumberControlsLayout
  /** 步长，默认 `1` */
  step?: number
  min?: number
  max?: number
  /** 小数精度；提交与步进时会按该精度取整 */
  precision?: number
  id?: string
  name?: string
  required?: boolean
  ariaLabel?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean
}

export function InputNumber(props: InputNumberProps) {
  const uncontrolled = createSignal<number | null>(props.defaultValue ?? null)
  const effective = createDerived(() => (props.value !== undefined ? props.value : uncontrolled()))

  const focused = createSignal(false)
  const draft = createSignal('')

  const commit = (next: number | null) => {
    let v = next
    if (v != null) {
      v = roundToPrecision(v, props.precision)
      v = clamp(v, props.min, props.max)
    }
    if (props.value === undefined) {
      uncontrolled.set(v)
    }
    props.onChange?.(v)
  }

  const displayText = createDerived(() => {
    if (focused()) return draft()
    return formatDisplay(effective(), props.precision)
  })

  const syncDraftFromEffective = () => {
    draft.set(formatDisplay(effective(), props.precision))
  }

  const onInput = (e: Event) => {
    if (props.disabled || props.readOnly) return
    const el = e.target as HTMLInputElement
    const raw = el.value
    draft.set(raw)
    const parsed = parseNumericInput(raw)
    if (parsed == null) {
      if (raw.trim() === '') {
        commit(null)
      }
      return
    }
    commit(parsed)
  }

  const stepBy = (dir: -1 | 1) => {
    if (props.disabled || props.readOnly) return
    const step = props.step ?? 1
    if (!Number.isFinite(step) || step <= 0) return
    const cur = effective()
    const base = cur ?? 0
    const next = roundToPrecision(base + dir * step, props.precision)
    const clamped = clamp(next, props.min, props.max)
    commit(clamped)
    if (focused()) {
      draft.set(formatDisplay(clamped, props.precision))
    }
  }

  const canDec = createDerived(() => {
    if (props.disabled || props.readOnly) return false
    const cur = effective()
    const step = props.step ?? 1
    if (props.min == null) return true
    const next = roundToPrecision((cur ?? 0) - step, props.precision)
    return next >= props.min - 1e-12
  })

  const canInc = createDerived(() => {
    if (props.disabled || props.readOnly) return false
    const cur = effective()
    const step = props.step ?? 1
    if (props.max == null) return true
    const next = roundToPrecision((cur ?? 0) + step, props.precision)
    return next <= props.max + 1e-12
  })

  return () => {
    const {
      disabled = false,
      readOnly = false,
      placeholder,
      size = 'middle',
      block = false,
      class: rootClass,
      prefix,
      suffix,
      controls = true,
      controlsLayout = 'split',
      id,
      name,
      required,
      onFocus,
      onBlur,
      onKeydown,
      ariaLabel,
      ariaDescribedby,
      ariaInvalid,
    } = props

    const useAffix = prefix != null || suffix != null || controls
    const sizeMod = size === 'middle' ? '' : ` vfui-input-affix--size-${size}`
    const sizeModInput = size === 'middle' ? '' : ` vfui-input--size-${size}`
    const blockMod = block ? ' vfui-input-affix--block' : ''
    const blockModSingle = block ? ' vfui-input--block' : ''
    const disabledMod = disabled ? ' vfui-input-affix--disabled' : ''
    const disabledModSingle = disabled ? ' vfui-input--disabled' : ''

    const affixCls = `vfui-input-affix${sizeMod}${blockMod}${disabledMod}${rootClass ? ` ${rootClass}` : ''}`
    const singleCls = `vfui-input${sizeModInput}${blockModSingle}${disabledModSingle}${rootClass ? ` ${rootClass}` : ''}`
    const nestedInputCls = `vfui-input vfui-input--in-affix${sizeModInput}`

    const handleFocus = (e: FocusEvent) => {
      focused.set(true)
      syncDraftFromEffective()
      onFocus?.(e)
    }

    const handleBlur = (e: FocusEvent) => {
      focused.set(false)
      const parsed = parseNumericInput(draft())
      if (parsed == null) {
        commit(null)
      } else {
        commit(parsed)
      }
      onBlur?.(e)
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (!disabled && !readOnly && controls) {
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          stepBy(1)
          return
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          stepBy(-1)
          return
        }
      }
      onKeydown?.(e)
    }

    const field = (
      <input
        id={id}
        type="text"
        inputMode="decimal"
        class={useAffix ? nestedInputCls : singleCls}
        value={displayText()}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        required={required}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid ? true : undefined}
        onInput={onInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeydown={handleKeydown}
      />
    )

    if (!useAffix) {
      return field
    }

    const decDisabled = disabled || readOnly || !canDec()
    const incDisabled = disabled || readOnly || !canInc()

    const decBtn = (
      <button
        type="button"
        class="vfui-input-number__step"
        disabled={decDisabled}
        aria-label="减少"
        onClick={() => stepBy(-1)}
      >
        −
      </button>
    )

    const incBtn = (
      <button
        type="button"
        class="vfui-input-number__step"
        disabled={incDisabled}
        aria-label="增加"
        onClick={() => stepBy(1)}
      >
        +
      </button>
    )

    const stackHandlers = (
      <div class="vfui-input-number__handlers vfui-input-number__handlers--stack" role="group" aria-label="步进">
        {incBtn}
        {decBtn}
      </div>
    )

    return (
      <div class={affixCls} aria-disabled={disabled ? true : undefined}>
        {prefix != null ? <span class="vfui-input-affix__addon vfui-input-affix__addon--prefix">{prefix}</span> : null}
        {controls && controlsLayout === 'split' ? decBtn : null}
        {field}
        {controls && controlsLayout === 'split' ? incBtn : null}
        {controls && controlsLayout === 'stack' ? stackHandlers : null}
        {suffix != null ? <span class="vfui-input-affix__addon vfui-input-affix__addon--suffix">{suffix}</span> : null}
      </div>
    )
  }
}
