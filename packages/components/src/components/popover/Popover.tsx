import type { JSXNode } from '@viewfly/core'
import { createDynamicRef, createEffect, createRef, createSignal, Portal, reactive } from '@viewfly/core'
import './style.scss'

export type PopoverPlacement =
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

export type PopoverTrigger = 'click' | 'hover'

export interface PopoverProps {
  title?: JSXNode
  content: JSXNode
  children?: JSXNode
  placement?: PopoverPlacement
  trigger?: PopoverTrigger
  gap?: number
  openDelay?: number
  closeDelay?: number
  flip?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  getContainer?: () => HTMLElement
  disabled?: boolean
  /** 是否显示指向触发器的小三角，默认 `true` */
  showArrow?: boolean
  /** 是否显示面板描边，默认 `true` */
  bordered?: boolean
}

const VIEWPORT_EDGE = 8

function defaultContainer(): HTMLElement {
  return typeof document !== 'undefined' ? document.body : (null as unknown as HTMLElement)
}

function parsePlacement(p: PopoverPlacement): { side: 'top' | 'bottom' | 'left' | 'right'; align: 'start' | 'center' | 'end' } {
  const [a, b] = p.split('-')
  return {
    side: a as 'top' | 'bottom' | 'left' | 'right',
    align: b as 'start' | 'center' | 'end',
  }
}

function oppositePlacement(p: PopoverPlacement): PopoverPlacement {
  const { side, align } = parsePlacement(p)
  if (side === 'top') return `bottom-${align}` as PopoverPlacement
  if (side === 'bottom') return `top-${align}` as PopoverPlacement
  if (side === 'left') return `right-${align}` as PopoverPlacement
  return `left-${align}` as PopoverPlacement
}

function placementHasRoom(
  placement: PopoverPlacement,
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

function spaceAlongOpening(
  placement: PopoverPlacement,
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
  preferred: PopoverPlacement,
  flipEnabled: boolean,
  r: DOMRect,
  pw: number,
  ph: number,
  gap: number,
  vw: number,
  vh: number,
  pad: number,
): PopoverPlacement {
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
  placement: PopoverPlacement,
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

export function Popover(props: PopoverProps) {
  const mounted = createSignal(false)
  const visible = createSignal(false)
  const layout = reactive({
    top: 0,
    left: 0,
    animSide: 'top' as 'top' | 'bottom' | 'left' | 'right',
    resolvedPlacement: 'top-center' as PopoverPlacement,
  })
  const triggerRef = createRef<HTMLElement>()
  let panelElement: HTMLElement | null = null
  let didScheduleDefaultOpen = false

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
    const gap = props.gap ?? 10
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
        if (props.open === undefined) {
          props.onOpenChange?.(true)
        }
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
    const wasShown = mounted()
    visible.set(false)
    mounted.set(false)
    if (wasShown) {
      props.onOpenChange?.(false)
    }
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

  const toggleByClick = () => {
    if (props.disabled) return
    const isOpen = props.open !== undefined ? props.open : mounted()
    if (isOpen) closeNow()
    else openNow()
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

  if (!didScheduleDefaultOpen && props.defaultOpen && props.open === undefined && !(props.disabled ?? false)) {
    didScheduleDefaultOpen = true
    queueMicrotask(() => {
      if (!props.disabled) openNow()
    })
  }

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

  createEffect([mounted], ([m]) => {
    if (!m) return
    if ((props.trigger ?? 'click') !== 'click') return

    const onDocMouseDown = (ev: MouseEvent) => {
      const n = ev.target as Node | null
      if (!n) return
      if (triggerRef.current?.contains(n)) return
      if (panelElement?.contains(n)) return
      closeNow()
    }

    document.addEventListener('mousedown', onDocMouseDown, true)
    return () => document.removeEventListener('mousedown', onDocMouseDown, true)
  })

  return () => {
    const triggerMode = props.trigger ?? 'click'
    const disabled = props.disabled ?? false
    const disabledClass = disabled ? ' vfui-popover--disabled' : ''
    const portalHost = props.getContainer?.() ?? defaultContainer()
    const v = visible()
    const openCls = v ? ' vfui-popover__panel--open' : ''
    const withTitleCls = props.title != null ? ' vfui-popover__panel--with-title' : ''
    const showArrow = props.showArrow ?? true
    const bordered = props.bordered ?? true
    const noArrowCls = showArrow ? '' : ' vfui-popover__panel--no-arrow'
    const borderCls = bordered ? '' : ' vfui-popover__panel--borderless'
    const animBySide: Record<typeof layout.animSide, string> = {
      top: ' vfui-popover__panel--anim-top',
      bottom: ' vfui-popover__panel--anim-bottom',
      left: ' vfui-popover__panel--anim-left',
      right: ' vfui-popover__panel--anim-right',
    }
    const animCls = animBySide[layout.animSide]

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

    return (
      <span class={`vfui-popover${disabledClass}`}>
        <span
          class="vfui-popover__trigger"
          ref={triggerRef}
          onClick={() => {
            if (props.open !== undefined) {
              props.onOpenChange?.(!props.open)
              return
            }
            if (triggerMode !== 'click') return
            toggleByClick()
          }}
          onMouseEnter={onTriggerEnter}
          onMouseLeave={onTriggerLeave}
        >
          {props.children}
        </span>
        <Portal host={portalHost}>
          {mounted() ? (
            <div
              ref={panelRef}
              data-placement={layout.resolvedPlacement}
              class={`vfui-popover__panel${animCls}${openCls}${withTitleCls}${noArrowCls}${borderCls}`}
              style={{
                top: `${layout.top}px`,
                left: `${layout.left}px`,
              }}
              role="dialog"
              aria-modal="false"
              onMouseEnter={() => {
                if (props.disabled) return
                if (props.open !== undefined) return
                if ((props.trigger ?? 'click') !== 'hover') return
                clearClose()
              }}
              onMouseLeave={() => {
                if (props.disabled) return
                if (props.open !== undefined) return
                if ((props.trigger ?? 'click') !== 'hover') return
                scheduleClose()
              }}
            >
              {props.title != null ? <div class="vfui-popover__title">{props.title}</div> : null}
              <div class="vfui-popover__content">{props.content}</div>
            </div>
          ) : null}
        </Portal>
      </span>
    )
  }
}
