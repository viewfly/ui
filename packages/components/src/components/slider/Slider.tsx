import { createRef, createSignal } from '@viewfly/core'
import type { TooltipPlacement } from '../tooltip/Tooltip'
import { Tooltip } from '../tooltip/Tooltip'
import './style.scss'

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

function snapToStep(raw: number, min: number, max: number, step: number) {
  if (!(step > 0) || !Number.isFinite(step)) {
    return clamp(raw, min, max)
  }
  const q = Math.round((raw - min) / step)
  const v = min + q * step
  const decimals = `${step}`.split('.')[1]?.length ?? 0
  return clamp(Number(v.toFixed(Math.min(8, decimals + 2))), min, max)
}

function defaultFormatTip(value: number, step: number) {
  if (!Number.isFinite(value)) return ''
  const decimals = `${step}`.split('.')[1]?.length ?? 0
  const rounded = Number(value.toFixed(Math.min(8, decimals + 2)))
  return Number.isInteger(rounded) ? String(rounded) : String(rounded)
}

export interface SliderProps {
  min?: number
  max?: number
  step?: number
  /** 受控值 */
  value?: number
  /** 非受控初始值 */
  defaultValue?: number
  disabled?: boolean
  /** 值变化（拖动、点击轨道、键盘） */
  onChange?: (value: number) => void
  /** 一次交互结束（松开指针 / 轨道点击 / 键盘调整） */
  onAfterChange?: (value: number) => void
  /** 拖动手柄时气泡文案，默认按 `step` 取小数位 */
  tipFormatter?: (value: number) => string
  /** 拖动提示（Tooltip）相对手柄的方位，默认 `top-center` */
  tipPlacement?: TooltipPlacement
  /** 手柄与提示层间距（px），默认 `8` */
  tipGap?: number
}

function initialUncontrolledValue(p: SliderProps) {
  const min = p.min ?? 0
  const max = p.max ?? 100
  const step = p.step ?? 1
  const base = p.defaultValue ?? min
  return snapToStep(base, min, max, step)
}

const docListenerOpts: AddEventListenerOptions = { capture: true }

export function Slider(props: SliderProps) {
  const railRef = createRef<HTMLDivElement>()
  const uncontrolled = createSignal(initialUncontrolledValue(props))
  const dragging = createSignal(false)

  const resolveValue = () => {
    const min = props.min ?? 0
    const max = props.max ?? 100
    const step = props.step ?? 1
    if (props.value !== undefined) {
      return snapToStep(props.value, min, max, step)
    }
    return snapToStep(uncontrolled(), min, max, step)
  }

  const commitValue = (next: number) => {
    const min = props.min ?? 0
    const max = props.max ?? 100
    const step = props.step ?? 1
    const v = snapToStep(next, min, max, step)
    const prev = resolveValue()
    if (props.value === undefined) {
      uncontrolled.set(v)
    }
    if (v !== prev) {
      props.onChange?.(v)
    }
    return v
  }

  const setFromClientX = (clientX: number) => {
    if (props.disabled) return
    const min = props.min ?? 0
    const max = props.max ?? 100
    const el = railRef.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0) return
    const ratio = (clientX - rect.left) / rect.width
    const raw = min + clamp(ratio, 0, 1) * (max - min)
    commitValue(raw)
  }

  let activePointerId: number | null = null

  const detachWindowListeners = () => {
    window.removeEventListener('pointermove', onWindowPointerMove, docListenerOpts)
    window.removeEventListener('pointerup', onWindowPointerEnd, docListenerOpts)
    window.removeEventListener('pointercancel', onWindowPointerEnd, docListenerOpts)
  }

  const finishDrag = () => {
    if (activePointerId == null) return
    activePointerId = null
    detachWindowListeners()
    dragging.set(false)
    props.onAfterChange?.(resolveValue())
  }

  const onWindowPointerMove = (e: PointerEvent) => {
    if (e.pointerId !== activePointerId) return
    setFromClientX(e.clientX)
  }

  const onWindowPointerEnd = (e: PointerEvent) => {
    if (e.pointerId !== activePointerId) return
    finishDrag()
  }

  const onRailPointerDown = (e: PointerEvent) => {
    if (props.disabled) return
    if (e.button !== 0) return
    const target = e.target as HTMLElement | null
    if (target?.closest?.('.vfui-slider__thumb')) return
    setFromClientX(e.clientX)
    props.onAfterChange?.(resolveValue())
  }

  const onThumbPointerDown = (e: PointerEvent) => {
    if (props.disabled) return
    if (e.button !== 0) return
    e.stopPropagation()
    dragging.set(true)
    activePointerId = e.pointerId
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    window.addEventListener('pointermove', onWindowPointerMove, docListenerOpts)
    window.addEventListener('pointerup', onWindowPointerEnd, docListenerOpts)
    window.addEventListener('pointercancel', onWindowPointerEnd, docListenerOpts)
  }

  const onThumbKeyDown = (e: KeyboardEvent) => {
    if (props.disabled) return
    const min = props.min ?? 0
    const max = props.max ?? 100
    const step = props.step ?? 1
    const page = (max - min) / 10
    const v = resolveValue()
    let next = v
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      next = v + step
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      next = v - step
    } else if (e.key === 'PageUp') {
      next = v + page
    } else if (e.key === 'PageDown') {
      next = v - page
    } else if (e.key === 'Home') {
      next = min
    } else if (e.key === 'End') {
      next = max
    } else {
      return
    }
    e.preventDefault()
    commitValue(next)
    props.onAfterChange?.(resolveValue())
  }

  return () => {
    const min = props.min ?? 0
    const max = props.max ?? 100
    const step = props.step ?? 1
    const disabled = props.disabled ?? false
    const value = resolveValue()
    const span = max - min || 1
    const percent = ((value - min) / span) * 100
    const tipText = props.tipFormatter ? props.tipFormatter(value) : defaultFormatTip(value, step)
    const tipPlacement = props.tipPlacement ?? 'top-center'
    const tipGap = props.tipGap ?? 8

    const disabledMod = disabled ? ' vfui-slider--disabled' : ''

    return (
      <div class={`vfui-slider${disabledMod}`}>
        <div
          ref={railRef}
          class="vfui-slider__rail"
          onPointerDown={onRailPointerDown}
        >
          <div class="vfui-slider__rail-bg" aria-hidden="true" />
          <div
            class="vfui-slider__fill"
            style={{ width: `${percent}%` }}
            aria-hidden="true"
          />
          <div class="vfui-slider__handle" style={{ left: `${percent}%` }}>
            <Tooltip
              content={tipText}
              open={dragging()}
              disabled={false}
              placement={tipPlacement}
              gap={tipGap}
              openDelay={0}
              closeDelay={0}
            >
              <div
                class="vfui-slider__thumb"
                role="slider"
                tabIndex={disabled ? -1 : 0}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                aria-valuetext={tipText}
                aria-disabled={disabled ? true : undefined}
                onPointerDown={onThumbPointerDown}
                onKeyDown={onThumbKeyDown}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    )
  }
}
