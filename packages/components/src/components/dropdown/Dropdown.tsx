import type { JSXNode, Signal } from '@viewfly/core'
import {
  createDynamicRef,
  createEffect,
  createRef,
  createSignal,
  inject,
  Portal,
  reactive,
} from '@viewfly/core'
import { acquireOverlayZIndex } from '../../utils/overlay-z-index'
import {
  VfuiDropdownNestProvider,
  VfuiDropdownNestToken,
  type VfuiDropdownNestContext,
} from './nest-context'
import { VfuiDropdownTriggerProvider } from './trigger-context'
import './style.scss'

export type DropdownTrigger = 'click' | 'hover'

/** `vertical`：上下弹出（默认）；`horizontal`：左右弹出 */
export type DropdownOrientation = 'vertical' | 'horizontal'

/** 横向弹出时优先的一侧；放不下时换到另一侧。仅 `orientation="horizontal"` 时有效 */
export type DropdownHorizontalAlign = 'left' | 'right'

/** 横向弹出时，面板与触发器在垂直方向上的对齐（相对视口再夹紧） */
export type DropdownHorizontalPanelAlign = 'top' | 'middle' | 'bottom'

/** 纵向弹出时，面板与触发器在水平方向上的对齐（相对视口再夹紧） */
export type DropdownVerticalPanelAlign = 'left' | 'center' | 'right'

export interface DropdownProps {
  /**
   * 下拉层内容（挂载到 `getContainer` 指定节点下）。
   * 可在内容中再嵌套 `Dropdown` 作为子菜单；父级会识别子面板的 Portal 节点，避免误触关闭。
   */
  dropdown: JSXNode
  /** 触发区域 */
  children?: JSXNode
  /** 打开方式：点击或悬停 */
  trigger?: DropdownTrigger
  /** 弹出方向：纵向（上下）或横向（左右） */
  orientation?: DropdownOrientation
  /**
   * 横向弹出时默认在哪一侧；该侧放不下时换到另一侧。
   * 默认 `left`；仅 `orientation="horizontal"` 时有效。
   */
  horizontalAlign?: DropdownHorizontalAlign
  /**
   * 横向弹出时，面板与触发器在垂直方向的对齐：顶对齐、垂直居中、底对齐。
   * 未指定时：根级触发器默认 `top`；嵌在另一 `Dropdown` 面板内（子菜单）默认 `middle`。
   * 仅 `orientation="horizontal"` 时有效。
   */
  horizontalPanelAlign?: DropdownHorizontalPanelAlign
  /**
   * 纵向弹出时，面板与触发器在水平方向的对齐：左、水平居中、右。
   * 默认 `left`；仅 `orientation="vertical"` 时有效。
   */
  verticalPanelAlign?: DropdownVerticalPanelAlign
  /**
   * 横向弹出时，面板上边缘不得低于该元素的上边缘（视口坐标），并与视口上边距取较大值，
   * 避免遮挡参考点上方的区域。返回 `null` 时不额外限制。仅 `orientation="horizontal"` 时有效。
   */
  getHorizontalTopMinFrom?: () => HTMLElement | null
  /**
   * 弹出层挂载的 DOM 节点；未传时默认 `document.body`。
   * 在子组件首次渲染时解析一次，与 `<Portal host>` 在挂载时确定容器的行为一致。
   */
  getContainer?: () => HTMLElement
  /** 面板与触发器之间的间距（px）：纵向为上下边距，横向为左右间距；默认 10 */
  gap?: number
  disabled?: boolean
  /**
   * 外部请求关闭：递增该 signal 的值会在面板打开时收起（如 Select 选中项后）。
   * 仅在同 signal 的值发生变化时生效（与 `createEffect` 一致：订阅初值不会触发回调）。
   */
  closeTick?: Signal<number>
  /** 面板展开动画完成后的 `expanded` 变化通知（`mounted` 打开过程中可能短暂为 false） */
  onOpenChange?: (open: boolean) => void
  /**
   * 为 true 时根容器与触发区横向占满父级宽度（如放在 `MenuList` 里作为占一整行的子菜单触发器）。
   * @default false
   */
  block?: boolean
  /** 菜单列紧凑布局（给内层 `MenuList` 提供紧凑列样式） */
  menuColumnCompact?: boolean
}

const HOVER_CLOSE_MS = 160
/** 弹出层与视口边缘的最小间距（px） */
const VIEWPORT_EDGE = 10

function defaultContainer(): HTMLElement {
  return typeof document !== 'undefined' ? document.body : (null as unknown as HTMLElement)
}

const OPEN_ANIM_DELAY_MS = 10

/** 触发器是否完全落在视口内；否则不再为「塞满视口」夹紧面板，仅保持与触发器的 gap（类原生 select） */
function triggerFullyInViewport(r: DOMRect, vw: number, vh: number) {
  return r.top >= 0 && r.left >= 0 && r.bottom <= vh && r.right <= vw
}

/** 可产生纵向/横向滚动的祖先（不含 body 之上的默认文档流，由 window 覆盖） */
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

function resolveOwnerPopoverId(triggerEl: HTMLElement | null | undefined): string | null {
  if (!triggerEl) return null
  const ownerPanel = triggerEl.closest('[data-vfui-popover-id]') as HTMLElement | null
  if (ownerPanel) return ownerPanel.dataset.vfuiPopoverId ?? null
  const ownerDropdown = triggerEl.closest('[data-vfui-popover-owner]') as HTMLElement | null
  return ownerDropdown?.dataset.vfuiPopoverOwner ?? null
}

export function Dropdown(props: DropdownProps) {
  const mounted = createSignal(false)
  const expanded = createSignal(false)
  const layout = reactive({
    top: 0,
    left: 0,
    zIndex: 0,
    minWidth: 0,
    placement: 'bottom' as 'top' | 'bottom' | 'left' | 'right',
  })
  const triggerRef = createRef<HTMLElement>()
  let panelElement: HTMLElement | null = null
  /** 子级 Dropdown 的 Portal 面板（不在本节点 DOM 子树内），点击外部关闭时需一并视为「菜单内」 */
  const nestedPanels = new Set<HTMLElement>()
  const parentNest = inject(VfuiDropdownNestToken, null)
  let ownerPopoverId: string | null = null

  let hoverCloseTimer: ReturnType<typeof setTimeout> | undefined
  let openAnimTimer: ReturnType<typeof setTimeout> | undefined

  const clearHoverClose = () => {
    if (hoverCloseTimer != null) {
      clearTimeout(hoverCloseTimer)
      hoverCloseTimer = undefined
    }
  }

  const clearOpenAnimTimer = () => {
    if (openAnimTimer != null) {
      clearTimeout(openAnimTimer)
      openAnimTimer = undefined
    }
  }

  const scheduleHoverClose = () => {
    clearHoverClose()
    hoverCloseTimer = setTimeout(() => {
      hoverCloseTimer = undefined
      closePanel()
    }, HOVER_CLOSE_MS)
  }

  const registerNestedPanel = (el: HTMLElement | null): (() => void) => {
    if (!el) return () => {}
    nestedPanels.add(el)
    const unregisterUp = parentNest?.registerNestedPanel(el)
    return () => {
      nestedPanels.delete(el)
      unregisterUp?.()
    }
  }

  const nestCtx: VfuiDropdownNestContext = {
    registerNestedPanel,
    onNestedPanelEnter: clearHoverClose,
  }

  const computeLayout = () => {
    const el = triggerRef.current
    if (!el) return
    const gap = props.gap ?? 10
    const orientation = props.orientation ?? 'vertical'
    const r = el.getBoundingClientRect()
    const vw = typeof window !== 'undefined' ? window.innerWidth : 0
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0
    const pad = VIEWPORT_EDGE
    const relaxViewportClamp = !triggerFullyInViewport(r, vw, vh)

    const panelH = panelElement?.offsetHeight ?? 0
    const panelW = panelElement?.offsetWidth ?? r.width
    const effW = Math.max(panelW, r.width)
    const effH = Math.max(panelH, 1)

    let top = 0
    let left = 0
    let placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom'

    if (orientation === 'horizontal') {
      const spaceLeft = r.left - gap - pad
      const spaceRight = vw - pad - (r.right + gap)
      const fitsLeft = panelW <= 0 || panelW <= spaceLeft
      const fitsRight = panelW <= 0 || panelW <= spaceRight
      const prefer = props.horizontalAlign ?? 'left'
      const vAlign =
        props.horizontalPanelAlign ?? (parentNest != null ? 'middle' : 'top')
      const hForAlign = panelH > 0 ? panelH : effH

      if (vAlign === 'top') {
        top = r.top
      } else if (vAlign === 'middle') {
        top = r.top + (r.height - hForAlign) / 2
      } else {
        top = r.bottom - hForAlign
      }
      const maxTop = vh - pad - hForAlign
      const refEl = props.getHorizontalTopMinFrom?.()
      if (relaxViewportClamp) {
        if (refEl != null) {
          top = Math.max(top, refEl.getBoundingClientRect().top)
        }
      } else {
        const floorTop =
          refEl != null ? Math.max(pad, refEl.getBoundingClientRect().top) : pad
        top = Math.min(maxTop, Math.max(top, floorTop))
      }

      const placeLeft = (w: number) => {
        placement = 'left'
        left = r.left - gap - w
        if (!relaxViewportClamp && left < pad) left = pad
      }
      const placeRight = (w: number) => {
        placement = 'right'
        left = r.right + gap
        if (!relaxViewportClamp) {
          const maxLeft = vw - pad - w
          if (left > maxLeft) left = Math.max(pad, maxLeft)
        }
      }

      if (panelW > 0) {
        if (relaxViewportClamp) {
          if (prefer === 'left') placeLeft(panelW)
          else placeRight(panelW)
        } else if (prefer === 'left') {
          if (fitsLeft) placeLeft(panelW)
          else placeRight(panelW)
        } else if (fitsRight) {
          placeRight(panelW)
        } else {
          placeLeft(panelW)
        }
      } else if (relaxViewportClamp) {
        if (prefer === 'left') {
          placement = 'left'
          left = r.left - gap - effW
        } else {
          placement = 'right'
          left = r.right + gap
        }
      } else if (prefer === 'left') {
        placement = 'left'
        left = r.left - gap - effW
        if (left < pad) left = pad
      } else {
        placement = 'right'
        left = r.right + gap
        const maxLeft = vw - pad - effW
        if (left > maxLeft) left = Math.max(pad, maxLeft)
      }
    } else {
      const spaceBelow = vh - pad - (r.bottom + gap)
      const spaceAbove = r.top - gap - pad

      const fitsBelow = panelH <= 0 || panelH <= spaceBelow
      const fitsAbove = panelH > 0 && panelH <= spaceAbove

      if (panelH > 0) {
        if (fitsBelow) {
          placement = 'bottom'
          top = r.bottom + gap
          if (!relaxViewportClamp) {
            const maxTop = vh - pad - panelH
            if (top > maxTop) top = Math.max(pad, maxTop)
          }
        } else if (fitsAbove) {
          placement = 'top'
          top = r.top - gap - panelH
          if (!relaxViewportClamp && top < pad) top = pad
        } else {
          placement = 'bottom'
          top = r.bottom + gap
        }
      } else {
        placement = 'bottom'
        top = r.bottom + gap
      }

      const hAlign = props.verticalPanelAlign ?? 'left'
      const wForAlign = panelW > 0 ? panelW : effW
      if (hAlign === 'left') {
        left = r.left
      } else if (hAlign === 'center') {
        left = r.left + (r.width - wForAlign) / 2
      } else {
        left = r.right - wForAlign
      }
      if (!relaxViewportClamp) {
        const minLeft = pad
        const maxLeft = vw - pad - wForAlign
        if (maxLeft >= minLeft) {
          left = Math.min(Math.max(left, minLeft), maxLeft)
        } else {
          left = minLeft
        }
      }
    }

    layout.top = top
    layout.left = left
    layout.minWidth = r.width
    layout.placement = placement
  }

  const openPanel = () => {
    if (props.disabled) return
    clearHoverClose()
    clearOpenAnimTimer()
    ownerPopoverId = resolveOwnerPopoverId(triggerRef.current)
    layout.zIndex = acquireOverlayZIndex()
    mounted.set(true)
    computeLayout()
    queueMicrotask(() => {
      computeLayout()
      requestAnimationFrame(() => {
        computeLayout()
        openAnimTimer = setTimeout(() => {
          openAnimTimer = undefined
          expanded.set(true)
        }, OPEN_ANIM_DELAY_MS)
      })
    })
  }

  const closePanel = () => {
    clearHoverClose()
    clearOpenAnimTimer()
    expanded.set(false)
    mounted.set(false)
  }

  const toggleClick = () => {
    if (props.disabled) return
    if (mounted() && expanded()) {
      closePanel()
      return
    }
    openPanel()
  }

  const panelRef = createDynamicRef<HTMLElement>((node) => {
    panelElement = node
    if (node) {
      if (ownerPopoverId) {
        node.dataset.vfuiPopoverOwner = ownerPopoverId
      } else {
        delete node.dataset.vfuiPopoverOwner
      }
    }
    let unregisterFromParent: (() => void) | undefined
    if (node) {
      unregisterFromParent = parentNest?.registerNestedPanel(node)
    }
    computeLayout()
    return () => {
      unregisterFromParent?.()
      unregisterFromParent = undefined
      panelElement = null
    }
  })

  createEffect(
    () => (props.closeTick == null ? null : props.closeTick()),
    (tick, prevTick) => {
      if (tick === null) {
        return
      }
      // Viewfly 的 createEffect 不在订阅时调用 callback；此处 prevTick 为上次依赖值（含初始值）。
      if (tick === prevTick) {
        return
      }
      closePanel()
    },
  )

  createEffect([expanded], ([ex]) => {
    props.onOpenChange?.(ex)
  })

  createEffect([mounted], ([m]) => {
    if (!m) return
    const onLayout = () => computeLayout()
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

  createEffect([mounted, expanded], ([m, ex]) => {
    if (!m || !ex) return

    const onDocMouseDown = (ev: MouseEvent) => {
      const n = ev.target as Node | null
      if (!n) return
      if (triggerRef.current?.contains(n)) return
      if (panelElement?.contains(n)) return
      for (const sub of nestedPanels) {
        if (sub.contains(n)) return
      }
      closePanel()
    }

    document.addEventListener('mousedown', onDocMouseDown, true)
    return () => document.removeEventListener('mousedown', onDocMouseDown, true)
  })

  return () => {
    const triggerMode = props.trigger ?? 'click'
    const disabled = props.disabled ?? false
    const disabledClass = disabled ? ' vfui-dropdown--disabled' : ''
    const blockClass = props.block ? ' vfui-dropdown--block' : ''
    const portalHost = props.getContainer?.() ?? defaultContainer()
    const ex = expanded()
    const openCls = ex ? ' vfui-dropdown__panel--open' : ''
    const compactMenuCls = props.menuColumnCompact ? ' vfui-dropdown__panel--menu-column-compact' : ''
    const animByPlacement: Record<typeof layout.placement, string> = {
      top: ' vfui-dropdown__panel--anim-top',
      bottom: ' vfui-dropdown__panel--anim-bottom',
      left: ' vfui-dropdown__panel--anim-left',
      right: ' vfui-dropdown__panel--anim-right',
    }
    const animCls = animByPlacement[layout.placement]

    return (
      <div class={`vfui-dropdown${disabledClass}${blockClass}`}>
        <VfuiDropdownTriggerProvider useValue={{ expanded }}>
          <div
            class="vfui-dropdown__trigger"
            ref={triggerRef}
            onClick={() => {
              if (triggerMode !== 'click' || disabled) return
              toggleClick()
            }}
            onMouseEnter={() => {
              if (triggerMode !== 'hover' || disabled) return
              openPanel()
            }}
            onMouseLeave={() => {
              if (triggerMode !== 'hover' || disabled) return
              scheduleHoverClose()
            }}
          >
            {props.children}
          </div>
        </VfuiDropdownTriggerProvider>
        <Portal host={portalHost}>
          {mounted() ? (
            <div
              ref={panelRef}
              class={`vfui-dropdown__panel${animCls}${openCls}${compactMenuCls}`}
              style={{
                top: `${layout.top}px`,
                left: `${layout.left}px`,
                zIndex: `${layout.zIndex}`,
                minWidth: `${layout.minWidth}px`,
              }}
              role="menu"
              onMouseEnter={() => {
                parentNest?.onNestedPanelEnter()
                if (props.trigger !== 'hover' || props.disabled) return
                clearHoverClose()
              }}
              onMouseLeave={() => {
                if (props.trigger !== 'hover' || props.disabled) return
                scheduleHoverClose()
              }}
            >
              <VfuiDropdownNestProvider useValue={nestCtx}>{props.dropdown}</VfuiDropdownNestProvider>
            </div>
          ) : null}
        </Portal>
      </div>
    )
  }
}
