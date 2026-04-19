import type { JSXNode } from '@viewfly/core'
import { createDynamicRef, createEffect, createRef, createSignal, Portal, reactive } from '@viewfly/core'
import './style.scss'

/**
 * 相对触发器的弹出方位（共 12 种）：
 * - `top-*` / `bottom-*`：沿触发器上/下缘展开，`*` 为水平对齐（start=左、center=中、end=右）
 * - `left-*` / `right-*`：沿触发器左/右侧展开，`*` 为垂直对齐（start=顶、center=中、end=底）
 */
export type TooltipPlacement =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end'
  | 'left-start'
  | 'left-center'
  | 'left-end'
  | 'right-start'
  | 'right-center'
  | 'right-end'

export type TooltipTrigger = 'hover' | 'focus'

export interface TooltipProps {
  /** 提示内容 */
  content: JSXNode
  /** 触发区域 */
  children?: JSXNode
  /** 弹出方位，默认 `top-center` */
  placement?: TooltipPlacement
  /** 触发方式：悬停或聚焦（聚焦时便于键盘与读屏） */
  trigger?: TooltipTrigger
  /** 与触发器之间的间距（px），默认 8 */
  gap?: number
  /** 悬停进入后延迟显示（ms），默认 60 */
  openDelay?: number
  /** 移出触发区或浮层后延迟关闭（ms），默认 120 */
  closeDelay?: number
  /**
   * 受控显隐：传入后完全由该布尔值决定是否展示，不再响应 `trigger` 的 hover / focus 打开与关闭
   *（仍走同一套定位、箭头与入场动画；与 Slider 拖动提示等场景配合时可设 `openDelay={0}`）。
   */
  open?: boolean
  /**
   * 当沿首选侧空间不足时，是否自动翻到对侧（如 `top-*` ↔ `bottom-*`，`left-*` ↔ `right-*`），对齐方式不变。
   * 默认 `true`；设为 `false` 则始终使用 `placement`。
   */
  flip?: boolean
  /**
   * 浮层挂载的 DOM 节点；未传时默认 `document.body`。
   * 在子组件首次渲染时解析一次，与 `<Portal host>` 在挂载时确定容器的行为一致。
   */
  getContainer?: () => HTMLElement
  disabled?: boolean
}

const VIEWPORT_EDGE = 8

function defaultContainer(): HTMLElement {
  return typeof document !== 'undefined' ? document.body : (null as unknown as HTMLElement)
}

function parsePlacement(p: TooltipPlacement): { side: 'top' | 'bottom' | 'left' | 'right'; align: 'start' | 'center' | 'end' } {
  const [a, b] = p.split('-')
  return {
    side: a as 'top' | 'bottom' | 'left' | 'right',
    align: b as 'start' | 'center' | 'end',
  }
}

function oppositePlacement(p: TooltipPlacement): TooltipPlacement {
  const { side, align } = parsePlacement(p)
  if (side === 'top') return `bottom-${align}` as TooltipPlacement
  if (side === 'bottom') return `top-${align}` as TooltipPlacement
  if (side === 'left') return `right-${align}` as TooltipPlacement
  return `left-${align}` as TooltipPlacement
}

/** 首选侧是否有足够空间放下浮层（未计夹紧） */
function placementHasRoom(
  placement: TooltipPlacement,
  r: DOMRect,
  pw: number,
  ph: number,
  gap: number,
  vw: number,
  vh: number,
  pad: number,
): boolean {
  const { side } = parsePlacement(placement)
  if (side === 'top') return r.top - gap - pad >= ph
  if (side === 'bottom') return vh - pad - r.bottom - gap >= ph
  if (side === 'left') return r.left - gap - pad >= pw
  return vw - pad - r.right - gap >= pw
}

/** 沿「开口」方向可用空间（px），两侧都不足时用于择优 */
function spaceAlongOpening(
  placement: TooltipPlacement,
  r: DOMRect,
  gap: number,
  vw: number,
  vh: number,
  pad: number,
): number {
  const { side } = parsePlacement(placement)
  if (side === 'top') return r.top - gap - pad
  if (side === 'bottom') return vh - pad - r.bottom - gap
  if (side === 'left') return r.left - gap - pad
  return vw - pad - r.right - gap
}

function resolvePlacementWithFlip(
  preferred: TooltipPlacement,
  flipEnabled: boolean,
  r: DOMRect,
  pw: number,
  ph: number,
  gap: number,
  vw: number,
  vh: number,
  pad: number,
): TooltipPlacement {
  if (!flipEnabled || pw <= 0 || ph <= 0) return preferred
  const alt = oppositePlacement(preferred)
  const primaryFits = placementHasRoom(preferred, r, pw, ph, gap, vw, vh, pad)
  const altFits = placementHasRoom(alt, r, pw, ph, gap, vw, vh, pad)
  if (primaryFits) return preferred
  if (altFits) return alt
  const sP = spaceAlongOpening(preferred, r, gap, vw, vh, pad)
  const sA = spaceAlongOpening(alt, r, gap, vw, vh, pad)
  return sA > sP ? alt : preferred
}

function computeLayout(
  placement: TooltipPlacement,
  r: DOMRect,
  pw: number,
  ph: number,
  gap: number,
  vw: number,
  vh: number,
) {
  const pad = VIEWPORT_EDGE
  const { side, align } = parsePlacement(placement)
  let top = 0
  let left = 0

  if (side === 'top') {
    top = r.top - gap - ph
    if (align === 'start') left = r.left
    else if (align === 'center') left = r.left + (r.width - pw) / 2
    else left = r.right - pw
  } else if (side === 'bottom') {
    top = r.bottom + gap
    if (align === 'start') left = r.left
    else if (align === 'center') left = r.left + (r.width - pw) / 2
    else left = r.right - pw
  } else if (side === 'left') {
    left = r.left - gap - pw
    if (align === 'start') top = r.top
    else if (align === 'center') top = r.top + (r.height - ph) / 2
    else top = r.bottom - ph
  } else {
    left = r.right + gap
    if (align === 'start') top = r.top
    else if (align === 'center') top = r.top + (r.height - ph) / 2
    else top = r.bottom - ph
  }

  const effW = Math.max(pw, 1)
  const effH = Math.max(ph, 1)
  const minL = pad
  const maxL = vw - pad - effW
  const minT = pad
  const maxT = vh - pad - effH
  if (maxL >= minL) left = Math.min(Math.max(left, minL), maxL)
  else left = minL
  if (maxT >= minT) top = Math.min(Math.max(top, minT), maxT)
  else top = minT

  return { top, left, animSide: side, placement }
}

/** 可产生纵向/横向滚动的祖先 */
function getScrollableAncestors(el: HTMLElement): HTMLElement[] {
  const list: HTMLElement[] = []
  let p: HTMLElement | null = el.parentElement
  while (p) {
    const st = getComputedStyle(p)
    const scrolls = (v: string) => v === 'auto' || v === 'scroll' || v === 'overlay'
    if (scrolls(st.overflowY) || scrolls(st.overflowX) || scrolls(st.overflow)) {
      list.push(p)
    }
    p = p.parentElement
  }
  return list
}

let tooltipIdSeq = 0

export function Tooltip(props: TooltipProps) {
  const mounted = createSignal(false)
  const visible = createSignal(false)
  const layout = reactive({
    top: 0,
    left: 0,
    animSide: 'top' as 'top' | 'bottom' | 'left' | 'right',
    /** 经翻转解析后的方位，用于定位、箭头与入场方向 */
    resolvedPlacement: 'top-center' as TooltipPlacement,
  })
  const triggerRef = createRef<HTMLElement>()
  let panelElement: HTMLElement | null = null
  const tooltipId = `vfui-tooltip-${++tooltipIdSeq}`

  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  const clearOpen = () => {
    if (openTimer != null) {
      clearTimeout(openTimer)
      openTimer = undefined
    }
  }

  const clearClose = () => {
    if (closeTimer != null) {
      clearTimeout(closeTimer)
      closeTimer = undefined
    }
  }

  const compute = () => {
    const el = triggerRef.current
    if (!el) return
    const gap = props.gap ?? 8
    const preferred = props.placement ?? 'top-center'
    const flipEnabled = props.flip ?? true
    const r = el.getBoundingClientRect()
    const vw = typeof window !== 'undefined' ? window.innerWidth : 0
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0
    const pw = panelElement?.offsetWidth ?? 0
    const ph = panelElement?.offsetHeight ?? 0
    const chosen = resolvePlacementWithFlip(preferred, flipEnabled, r, pw, ph, gap, vw, vh, VIEWPORT_EDGE)
    const { top, left, animSide, placement: resolved } = computeLayout(chosen, r, pw, ph, gap, vw, vh)
    layout.top = top
    layout.left = left
    layout.animSide = animSide
    layout.resolvedPlacement = resolved
  }

  const openNow = () => {
    if (props.disabled) return
    clearOpen()
    clearClose()
    mounted.set(true)
    compute()
    queueMicrotask(() => {
      compute()
      requestAnimationFrame(() => {
        compute()
        visible.set(true)
      })
    })
  }

  const scheduleOpen = () => {
    if (props.disabled) return
    clearClose()
    clearOpen()
    const d = props.openDelay ?? 60
    if (d <= 0) {
      openNow()
      return
    }
    openTimer = setTimeout(() => {
      openTimer = undefined
      openNow()
    }, d)
  }

  const closeNow = () => {
    clearOpen()
    clearClose()
    visible.set(false)
    mounted.set(false)
  }

  const scheduleClose = () => {
    clearClose()
    const d = props.closeDelay ?? 120
    if (d <= 0) {
      closeNow()
      return
    }
    closeTimer = setTimeout(() => {
      closeTimer = undefined
      closeNow()
    }, d)
  }

  const panelRef = createDynamicRef<HTMLElement>((node) => {
    panelElement = node
    compute()
    return () => {
      panelElement = null
    }
  })

  createEffect(
    () => {
      if (props.open === undefined) return 'uc' as const
      if (props.disabled ?? false) return 'dis' as const
      return props.open ? ('on' as const) : ('off' as const)
    },
    (mode) => {
      if (mode === 'uc') return
      if (mode === 'dis') {
        closeNow()
        return
      }
      if (mode === 'on') {
        openNow()
      } else {
        closeNow()
      }
    },
  )

  createEffect(
    () => {
      void mounted()
      void visible()
      return props.content
    },
    () => {
      if (!mounted() || !visible()) return
      queueMicrotask(() => compute())
    },
  )

  createEffect([mounted], ([m]) => {
    if (!m) return
    const onLayout = () => compute()
    window.addEventListener('resize', onLayout)

    const scrollTargets = new Set<EventTarget>()
    const addScroll = (t: EventTarget) => {
      if (!scrollTargets.has(t)) {
        scrollTargets.add(t)
        t.addEventListener('scroll', onLayout, true)
      }
    }
    addScroll(window)

    const bindScrollParents = () => {
      const el = triggerRef.current
      if (!el) return
      for (const node of getScrollableAncestors(el)) {
        addScroll(node)
      }
    }
    bindScrollParents()
    queueMicrotask(bindScrollParents)
    requestAnimationFrame(bindScrollParents)

    return () => {
      window.removeEventListener('resize', onLayout)
      for (const t of scrollTargets) {
        t.removeEventListener('scroll', onLayout, true)
      }
    }
  })

  function TooltipPortal() {
    const portalHost = props.getContainer?.() ?? defaultContainer()
    return () => {
      const v = visible()
      const openCls = v ? ' vfui-tooltip__panel--open' : ''
      const animBySide: Record<typeof layout.animSide, string> = {
        top: ' vfui-tooltip__panel--anim-top',
        bottom: ' vfui-tooltip__panel--anim-bottom',
        left: ' vfui-tooltip__panel--anim-left',
        right: ' vfui-tooltip__panel--anim-right',
      }
      const animCls = animBySide[layout.animSide]

      return (
        <Portal host={portalHost}>
          {mounted() ? (
            <div
              ref={panelRef}
              id={tooltipId}
              data-placement={layout.resolvedPlacement}
              class={`vfui-tooltip__panel${animCls}${openCls}`}
              style={{
                top: `${layout.top}px`,
                left: `${layout.left}px`,
              }}
              role="tooltip"
              onMouseEnter={() => {
                if (props.disabled) return
                if (props.open !== undefined) return
                clearClose()
              }}
              onMouseLeave={() => {
                if (props.disabled) return
                if (props.open !== undefined) return
                if ((props.trigger ?? 'hover') !== 'hover') return
                scheduleClose()
              }}
            >
              {props.content}
            </div>
          ) : null}
        </Portal>
      )
    }
  }

  return () => {
    const triggerMode = props.trigger ?? 'hover'
    const disabled = props.disabled ?? false
    const disabledClass = disabled ? ' vfui-tooltip--disabled' : ''
    const describedBy = mounted() && visible() ? tooltipId : undefined

    const onTriggerEnter = () => {
      if (disabled) return
      if (props.open !== undefined) return
      if (triggerMode !== 'hover') return
      scheduleOpen()
    }
    const onTriggerLeave = () => {
      if (disabled) return
      if (props.open !== undefined) return
      if (triggerMode !== 'hover') return
      clearOpen()
      scheduleClose()
    }

    const onFocusIn = (ev: FocusEvent) => {
      if (disabled) return
      if (props.open !== undefined) return
      if (triggerMode !== 'focus') return
      const root = triggerRef.current
      if (!root) return
      const t = ev.target as Node | null
      if (t && root.contains(t)) scheduleOpen()
    }
    const onFocusOut = (ev: FocusEvent) => {
      if (disabled) return
      if (props.open !== undefined) return
      if (triggerMode !== 'focus') return
      const root = triggerRef.current
      if (!root) return
      const related = ev.relatedTarget as Node | null
      if (related && root.contains(related)) return
      if (related && panelElement?.contains(related)) return
      clearOpen()
      scheduleClose()
    }

    return (
      <span class={`vfui-tooltip${disabledClass}`}>
        <span
          class="vfui-tooltip__trigger"
          ref={triggerRef}
          aria-describedby={describedBy}
          onMouseEnter={onTriggerEnter}
          onMouseLeave={onTriggerLeave}
          onFocusIn={onFocusIn}
          onFocusOut={onFocusOut}
        >
          {props.children}
        </span>
        <TooltipPortal />
      </span>
    )
  }
}
