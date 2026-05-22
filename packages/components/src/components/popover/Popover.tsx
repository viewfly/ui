import {
  computed, createContextProvider,
  createDynamicRef,
  createRef,
  createSignal, getCurrentInstance, inject,
  JSXNode,
  onMounted, onUnmounted,
  Portal,
  reactive, watch
} from '@viewfly/core'
import type { Signal } from '@viewfly/core'
import type { CSSProperties, StyleValue } from '@viewfly/platform-browser'
import { fromEvent, Subscription } from '@tanbo/stream'
import { acquireOverlayZIndex } from '../../utils/overlay-z-index'
import { resolveVfuiPortalThemeClass } from '../../utils/overlay-theme-class'
import { DropdownNestContext } from '../dropdown/nest-context'
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

export interface PopoverReferenceBox {
  left: number
  top: number
  width: number
  height: number
}

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
  closeTick?: Signal<number>
  onOpenChange?: (open: boolean) => void
  getContainer?: () => HTMLElement
  disabled?: boolean
  /** 是否显示指向触发器的小三角，默认 `true` */
  showArrow?: boolean
  /** 是否显示面板描边，默认 `true` */
  bordered?: boolean
  /** 是否移除面板内边距，默认 `false` */
  noPadding?: boolean
  /** 参考盒子（视口坐标系）。传入后按该矩形定位弹层，而不是触发器 DOM */
  referenceBox?: PopoverReferenceBox
  /** 实时获取参考盒子（视口坐标系）；优先级高于 `referenceBox`，用于滚动等场景动态定位 */
  getReferenceBox?: () => PopoverReferenceBox | null | undefined
  /** 弹层根节点内联样式，用于覆盖默认样式 */
  style?: StyleValue
}

function mergePanelStyle(base: CSSProperties, user: StyleValue | undefined): string | CSSProperties {
  if (user == null) return base
  if (typeof user === 'string') {
    const baseCss = `top:${String(base.top)};left:${String(base.left)};z-index:${String(base.zIndex)};`
    return `${baseCss}${user}`
  }
  return {...base, ...user}
}

const VIEWPORT_EDGE = 8
/** 纵向弹出 center 对齐时，面板距视口左右边缘的最小间距 */
const POPOVER_HORIZONTAL_EDGE = 10
let popoverIdSeq = 0

function defaultContainer(): HTMLElement {
  return typeof document !== 'undefined' ? document.body : (null as unknown as HTMLElement)
}

function parsePlacement(p: PopoverPlacement): {
  side: 'top' | 'bottom' | 'left' | 'right';
  align: 'start' | 'center' | 'end'
} {
  const [a, b] = p.split('-')
  return {
    side: a as 'top' | 'bottom' | 'left' | 'right',
    align: b as 'start' | 'center' | 'end',
  }
}

function oppositePlacement(p: PopoverPlacement): PopoverPlacement {
  const {side, align} = parsePlacement(p)
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
  const {side} = parsePlacement(placement)
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
  const {side} = parsePlacement(placement)
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
) {
  const {side, align} = parsePlacement(placement)
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

  return {top, left, animSide: side, placement}
}

function viewportClientWidth(): number {
  if (typeof document === 'undefined') return 0
  return document.documentElement.clientWidth
}

/** 纵向 center：左右至少 pad；右侧放不下时优先保留左侧 pad */
function clampPanelLeftForVerticalCenter(left: number, panel: HTMLElement, pad: number): number {
  const vw = viewportClientWidth()
  const pw = Math.ceil(panel.getBoundingClientRect().width) || panel.offsetWidth
  if (vw <= 0 || pw <= 0) return left
  const minLeft = pad
  const maxLeft = vw - pad - pw
  if (maxLeft >= minLeft) {
    return Math.min(maxLeft, Math.max(minLeft, left))
  }
  return minLeft
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

function resolveReferenceRect(
  triggerEl: HTMLElement | null | undefined,
  referenceBox: PopoverReferenceBox | undefined,
  getReferenceBox: (() => PopoverReferenceBox | null | undefined) | undefined,
): DOMRect | null {
  const dynamicBox = getReferenceBox?.()
  if (dynamicBox != null) {
    return new DOMRect(dynamicBox.left, dynamicBox.top, dynamicBox.width, dynamicBox.height)
  }
  if (referenceBox != null) {
    return new DOMRect(referenceBox.left, referenceBox.top, referenceBox.width, referenceBox.height)
  }
  return triggerEl?.getBoundingClientRect() ?? null
}

export function Popover(props: PopoverProps) {
  const expanded = createSignal(false)
  const visible = createSignal(false)
  const panelInteractive = createSignal(false)
  const computedExpanded = computed(() => {
    return typeof props.open === 'boolean' ? props.open : expanded()
  })
  const triggerType = computed(() => {
    return props.trigger === 'hover' ? 'hover' : 'click'
  })

  const layout = reactive({
    top: 0,
    left: 0,
    zIndex: 0,
    animSide: 'top' as 'top' | 'bottom' | 'left' | 'right',
    resolvedPlacement: 'top-center' as PopoverPlacement,
  })
  const triggerRef = createRef<HTMLElement>()
  let panelElement: HTMLElement | null = null
  let cleanupLayoutFollow: (() => void) | null = null
  const parentNest = inject(DropdownNestContext)
  const popoverId = `vfui-popover-${++popoverIdSeq}`

  const compute = () => {
    if (!computedExpanded.value) return
    const r = resolveReferenceRect(triggerRef.value, props.referenceBox, props.getReferenceBox)
    if (!r) return
    if (!panelElement) return
    const pw = panelElement.offsetWidth
    const ph = panelElement.offsetHeight
    if (pw === 0 && ph === 0) {
      requestAnimationFrame(() => {
        if (computedExpanded.value && panelElement) compute()
      })
      return
    }
    const gap = props.gap ?? 10
    const preferred = props.placement ?? 'top-center'
    const flipEnabled = props.flip ?? true
    const vw = typeof window !== 'undefined' ? window.innerWidth : 0
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0
    const chosen = resolvePlacementWithFlip(preferred, flipEnabled, r, pw, ph, gap, vw, vh, VIEWPORT_EDGE)
    const {top, left, animSide, placement: resolved} = computeLayout(chosen, r, pw, ph, gap)
    const {side, align} = parsePlacement(resolved)
    const finalLeft =
      (side === 'top' || side === 'bottom') && align === 'center'
        ? clampPanelLeftForVerticalCenter(left, panelElement, POPOVER_HORIZONTAL_EDGE)
        : left
    layout.top = top
    layout.left = finalLeft
    layout.animSide = animSide
    layout.resolvedPlacement = resolved
  }

  const bindLayoutFollow = () => {
    const triggerEl = triggerRef.value
    if (!triggerEl) return null
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
      for (const node of getScrollableAncestors(triggerEl)) {
        addScroll(node)
      }
    }
    requestAnimationFrame(bindScrollParents)

    return () => {
      window.removeEventListener('resize', onLayout)
      for (const t of scrollTargets) {
        t.removeEventListener('scroll', onLayout, true)
      }
    }
  }

  let leaveTimer: any = null
  let openTimer: any = null
  let canHide = true
  let clickFromSelf = false
  let pointerInSelf = false

  function triggerClick() {
    clickFromSelf = true
    if (triggerType.value !== 'click') return
    expanded.set(!expanded())
  }

  function triggerMouseEnter() {
    if (props.disabled || triggerType.value !== 'hover') return
    clearTimeout(leaveTimer)
    clearTimeout(openTimer)
    const d = props.openDelay ?? 60
    if (d <= 0) {
      expanded.set(true)
      parentNest.onSubDropdownOpened.next()
    } else {
      openTimer = setTimeout(() => {
        expanded.set(true)
        parentNest.onSubDropdownOpened.next()
      }, d)
    }
  }

  function triggerMouseLeave() {
    if (props.disabled || triggerType.value !== 'hover' || !canHide) return
    clearTimeout(leaveTimer)
    const d = props.closeDelay ?? 120
    leaveTimer = setTimeout(() => {
      expanded.set(false)
      parentNest.onMouseLeaveSubPanel.next()
    }, d)
  }

  watch(() => computedExpanded.value, (v) => {
    if (v) {
      panelInteractive.set(false)
      if (!cleanupLayoutFollow) {
        cleanupLayoutFollow = bindLayoutFollow()
      }
      requestAnimationFrame(() => {
        compute()
        visible.set(true)
      })
    } else {
      panelInteractive.set(false)
      visible.set(false)
      cleanupLayoutFollow?.()
      cleanupLayoutFollow = null
    }
    v ? parentNest.onSubDropdownOpened.next() : parentNest.onSubDropdownClosed.next()
    props.onOpenChange?.(v)
  })

  watch(() => props.closeTick?.(), () => {
    expanded.set(false)
  })

  const instance = getCurrentInstance()
  watch(expanded, (v) => {
    if (v) {
      parentNest.onSiblingDropdownOpen.next(instance)
    }
  })

  const dropdownNestContext = new DropdownNestContext()

  const sub = parentNest.onSiblingDropdownOpen.subscribe((dropdown) => {
    if (dropdown === instance) return
    canHide = true
    expanded.set(false)
  })

  sub.add(
    dropdownNestContext.onSubPanelClicked.subscribe(() => {
      clickFromSelf = true
      parentNest.onSubPanelClicked.next()
    }),
    dropdownNestContext.onSubDropdownOpened.subscribe(() => {
      canHide = false
      clearTimeout(leaveTimer)
    }),
    dropdownNestContext.onSubDropdownClosed.subscribe(() => {
      canHide = true
    }),
    dropdownNestContext.onMouseEnterSubPanel.subscribe(() => {
      canHide = false
      clearTimeout(leaveTimer)
    }),
    dropdownNestContext.onMouseLeaveSubPanel.subscribe(() => {
      canHide = true
      if (pointerInSelf) return
      if (triggerType.value === 'hover' && canHide) {
        expanded.set(false)
      }
    })
  )

  watch(
    () => {
      void computedExpanded.value
      void visible()
      return props.content
    },
    () => {
      if (!computedExpanded.value || !visible()) return
      queueMicrotask(() => compute())
    },
  )

  watch(
    () => {
      void computedExpanded.value
      void visible()
      const dynamicBox = props.getReferenceBox?.()
      if (dynamicBox != null) {
        return `dynamic:${dynamicBox.left},${dynamicBox.top},${dynamicBox.width},${dynamicBox.height}`
      }
      const staticBox = props.referenceBox
      if (staticBox == null) return null
      return `static:${staticBox.left},${staticBox.top},${staticBox.width},${staticBox.height}`
    },
    () => {
      if (!computedExpanded.value || !visible()) return
      queueMicrotask(() => compute())
    },
  )

  onUnmounted(() => {
    sub.unsubscribe()
    clearTimeout(leaveTimer)
    clearTimeout(openTimer)
    cleanupLayoutFollow?.()
    cleanupLayoutFollow = null
  })

  onMounted(() => {
    if (props.defaultOpen && props.open === undefined && !(props.disabled ?? false)) {
      queueMicrotask(() => {
        if (!props.disabled) expanded.set(true)
      })
    }
  })

  const panelRef = createDynamicRef<HTMLElement>((node) => {
    panelElement = node
    let resizeObserver: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (computedExpanded.value) compute()
      })
      resizeObserver.observe(node)
    }

    layout.zIndex = acquireOverlayZIndex()
    requestAnimationFrame(() => compute())

    const subscription = new Subscription()

    subscription.add(fromEvent(node, 'mouseenter').subscribe(() => {
      pointerInSelf = true
      parentNest.onMouseEnterSubPanel.next()
      if (triggerType.value === 'hover') {
        clearTimeout(leaveTimer)
      }
    }))
    subscription.add(fromEvent(node, 'mouseleave').subscribe(() => {
      pointerInSelf = false
      triggerMouseLeave()
    }))
    subscription.add(fromEvent(node, 'animationend').subscribe(() => {
      if (computedExpanded.value) {
        panelInteractive.set(true)
      }
    }))

    subscription.add(fromEvent(document, 'mousedown').subscribe(() => {
      if (clickFromSelf) {
        clickFromSelf = false
        return
      }
      canHide = true
      expanded.set(false)
    }))
    subscription.add(fromEvent(node, 'mousedown').subscribe(() => {
      clickFromSelf = true
      parentNest.onSubPanelClicked.next()
    }))

    return () => {
      resizeObserver?.disconnect()
      subscription.unsubscribe()
      panelElement = null
    }
  })

  const VfuiDropdownNestProvider = createContextProvider({
    provide: DropdownNestContext
  })

  return () => {
    const disabled = props.disabled ?? false
    const disabledClass = disabled ? ' vfui-popover--disabled' : ''
    const portalHost = props.getContainer?.() ?? defaultContainer()
    const v = visible()
    const openCls = v ? ' vfui-popover__panel--open' : ''
    const withTitleCls = props.title != null ? ' vfui-popover__panel--with-title' : ''
    const showArrow = props.showArrow ?? true
    const bordered = props.bordered ?? true
    const noPadding = props.noPadding ?? false
    const noArrowCls = showArrow ? '' : ' vfui-popover__panel--no-arrow'
    const borderCls = bordered ? '' : ' vfui-popover__panel--borderless'
    const noPaddingCls = noPadding ? ' vfui-popover__panel--no-padding' : ''
    const animBySide: Record<typeof layout.animSide, string> = {
      top: ' vfui-popover__panel--anim-top',
      bottom: ' vfui-popover__panel--anim-bottom',
      left: ' vfui-popover__panel--anim-left',
      right: ' vfui-popover__panel--anim-right',
    }
    const animCls = animBySide[layout.animSide]
    const interactiveCls = panelInteractive() ? ' vfui-popover__panel--interactive' : ''
    const themePortalCls = resolveVfuiPortalThemeClass(triggerRef.value)

    return (
      <span class={`vfui-popover${disabledClass}`}>
        <span
          class="vfui-popover__trigger"
          ref={triggerRef}
          onMouseDown={triggerClick}
          onMouseEnter={triggerMouseEnter}
          onMouseLeave={triggerMouseLeave}
        >
          {props.children}
        </span>
        <Portal container={portalHost}>
          <VfuiDropdownNestProvider useValue={dropdownNestContext}>
            {computedExpanded.value ? (
              <div
                ref={panelRef}
                data-vfui-popover-id={popoverId}
                data-placement={layout.resolvedPlacement}
                class={`vfui-popover__panel${animCls}${openCls}${withTitleCls}${noArrowCls}${borderCls}${noPaddingCls}${interactiveCls}${themePortalCls}`}
                style={mergePanelStyle(
                  {
                    top: `${layout.top}px`,
                    left: `${layout.left}px`,
                    zIndex: `${layout.zIndex}`,
                  },
                  props.style,
                )}
                role="dialog"
                aria-modal="false"
              >
                {props.title != null ? <div class="vfui-popover__title">{props.title}</div> : null}
                <div class="vfui-popover__content">{props.content}</div>
              </div>
            ) : null}
          </VfuiDropdownNestProvider>
        </Portal>
      </span>
    )
  }
}
