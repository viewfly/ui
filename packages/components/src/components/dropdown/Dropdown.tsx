import {
  Component,
  computed,
  createDynamicRef,
  createRef,
  createSignal, getCurrentInstance, inject,
  onMounted, onUnmounted,
  Portal,
  reactive, watch
} from '@viewfly/core'
import { fromEvent, Subscription } from '@tanbo/stream'
import { acquireOverlayZIndex } from '../../utils/overlay-z-index'
import { resolveVfuiPortalThemeClass } from '../../utils/overlay-theme-class'
import { computeDropdownLayout } from './dropdown-layout'
import { defaultDropdownContainer, getScrollableAncestors, resolveOwnerPopoverId } from './dropdown-dom'
import type { DropdownProps } from './dropdown-types'
import './style.scss'
import { VfuiDropdownTriggerProvider } from './trigger-context'
import { VfuiDropdownNestContext, VfuiDropdownNestProvider, VfuiDropdownNestToken } from './nest-context'
import { DROPDOWN_HOVER_CLOSE_MS } from './dropdown-constants'

const dropdownCloseRecord = new Map<Component, () => void>()

export function Dropdown(props: DropdownProps) {
  const expanded = createSignal(false)
  const panelInteractive = createSignal(false)
  const computedExpanded = computed(() => {
    return typeof props.open === 'boolean' ? props.open : expanded()
  })
  const triggerType = computed(() => {
    return props.trigger === 'hover' ? 'hover' : 'click'
  })

  /** 面板定位结果：由 computeDropdownLayout 写入 */
  const layout = reactive({
    top: 0,
    left: 0,
    zIndex: 0,
    minWidth: 0,
    maxHeight: 0,
    placement: 'bottom' as 'top' | 'bottom' | 'left' | 'right',
  })
  /** 触发器元素（作为定位参考） */
  const triggerRef = createRef<HTMLDivElement>()
  /** 面板元素（用于读取面板宽高） */
  let panelElement: HTMLElement | null = null
  let ownerPopoverId: string | null = null
  let cleanupLayoutFollow: (() => void) | null = null

  const computeLayout = () => {
    if (!computedExpanded.value) return
    const el = triggerRef.value
    if (!el) return
    const gap = props.gap ?? 10
    const orientation = props.orientation ?? 'vertical'
    const r = el.getBoundingClientRect()
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0

    computeDropdownLayout({
      triggerRect: r,
      panelElement,
      gap,
      orientation,
      horizontalAlign: props.horizontalAlign,
      horizontalPanelAlign: props.horizontalPanelAlign,
      verticalPanelAlign: props.verticalPanelAlign,
      getHorizontalTopMinFrom: props.getHorizontalTopMinFrom,
      vh,
      layout,
      panelMaxHeightCap: props.maxHeight ?? 400,
    })
  }

  const bindLayoutFollow = () => {
    const triggerEl = triggerRef.value
    if (!triggerEl) return null
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
      for (const node of getScrollableAncestors(triggerEl)) {
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
  }

  /**
   * 定位跟随仅在展开时启用：
   * - 视口 resize
   * - trigger 的可滚动祖先滚动
   */
  onMounted(() => {
    const triggerEl = triggerRef.value
    if (triggerEl) {
      ownerPopoverId = resolveOwnerPopoverId(triggerEl)
    }

    return () => {
      clearTimeout(leaveTimer)
      cleanupLayoutFollow?.()
      cleanupLayoutFollow = null
    }
  })

  let leaveTimer: any = null
  let canHide = true

  function triggerMouseEnter() {
    if (props.disabled || triggerType.value !== 'hover') return
    expanded.set(true)
    parentNest?.onSubDropdownOpened()
    clearTimeout(leaveTimer)
  }

  function triggerMouseLeave() {
    if (props.disabled || triggerType.value !== 'hover' || !canHide) return
    clearTimeout(leaveTimer)
    leaveTimer = setTimeout(() => {
      expanded.set(false)
      parentNest?.onMouseLeaveSubPanel()
    }, DROPDOWN_HOVER_CLOSE_MS)
  }

  const parentNest = inject(VfuiDropdownNestToken, null)

  watch(() => computedExpanded.value, (v) => {
    if (v) {
      panelInteractive.set(false)
      if (!cleanupLayoutFollow) {
        cleanupLayoutFollow = bindLayoutFollow()
      }
      queueMicrotask(computeLayout)
    } else {
      panelInteractive.set(false)
      cleanupLayoutFollow?.()
      cleanupLayoutFollow = null
    }
    v ? parentNest?.onSubDropdownOpened() : parentNest?.onSubDropdownClosed()
    props.onOpenChange?.(v)
  })
  watch(() => props.closeTick?.(), () => {
    expanded.set(false)
  })

  const instance = getCurrentInstance()
  dropdownCloseRecord.set(instance, () => {
    if (triggerType.value === 'hover' && canHide) {
      expanded.set(false)
    }
  })
  onUnmounted(() => {
    dropdownCloseRecord.delete(instance)
  })
  watch(expanded, (v) => {
    if (v) {
      dropdownCloseRecord.forEach((close, comp) => {
        if (comp !== instance) {
          close()
        }
      })
    }
  })

  let pointerInSelf = false

  const dropdownNestContext: VfuiDropdownNestContext = {
    onSubPanelClicked() {
      clickFromSelf = true
      parentNest?.onSubPanelClicked()
    },
    onSubDropdownOpened() {
      canHide = false
      clearTimeout(leaveTimer)
    },
    onSubDropdownClosed() {
      canHide = true
    },
    onMouseEnterSubPanel() {
      canHide = false
      clearTimeout(leaveTimer)
    },
    onMouseLeaveSubPanel() {
      canHide = true
      if (pointerInSelf) {
        return
      }
      if (triggerType.value === 'hover' && canHide) {
        expanded.set(false)
      }
    }
  }

  let clickFromSelf = false

  function triggerClick() {
    clickFromSelf = true
    if (triggerType.value !== 'click') return
    expanded.set(!expanded())
  }

  /**
   * 面板 ref：挂载后计算布局；卸载时清空引用。
   * 注意：这里不再注册 nested panel。
   */
  const panelRef = createDynamicRef<HTMLElement>((node) => {
    panelElement = node
    setTimeout(() => {
      layout.zIndex = acquireOverlayZIndex()
      computeLayout()
    })

    const subscription = new Subscription()

    subscription.add(fromEvent(node, 'mouseenter').subscribe(() => {
      pointerInSelf = true
      parentNest?.onMouseEnterSubPanel()
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

    subscription.add(fromEvent(document, 'click').subscribe(() => {
      if (clickFromSelf) {
        clickFromSelf = false
        return
      }
      canHide = true
      expanded.set(false)
    }))
    subscription.add(fromEvent(node, 'click').subscribe(() => {
      clickFromSelf = true
      parentNest?.onSubPanelClicked()
    }))

    return () => {
      subscription.unsubscribe()
      panelElement = null
    }
  })

  const triggerProviderValue = {
    expanded
  }

  return () => {
    const disabled = props.disabled ?? false
    const panelMaxHeight = Math.max(0, Math.min(layout.maxHeight, props.maxHeight ?? 400))
    const disabledClass = disabled ? ' vfui-dropdown--disabled' : ''
    const blockClass = props.block ? ' vfui-dropdown--block' : ''
    const portalHost = props.getContainer?.() ?? defaultDropdownContainer()
    const openCls = computedExpanded.value ? ' vfui-dropdown__panel--open' : ''
    const compactMenuCls = props.menuColumnCompact ? ' vfui-dropdown__panel--menu-column-compact' : ''
    const animByPlacement: Record<typeof layout.placement, string> = {
      top: ' vfui-dropdown__panel--anim-top',
      bottom: ' vfui-dropdown__panel--anim-bottom',
      left: ' vfui-dropdown__panel--anim-left',
      right: ' vfui-dropdown__panel--anim-right',
    }
    const animCls = animByPlacement[layout.placement]
    const interactiveCls = panelInteractive() ? ' vfui-dropdown__panel--interactive' : ''
    const themePortalCls = resolveVfuiPortalThemeClass(triggerRef.value)

    return (
      <div class={`vfui-dropdown${disabledClass}${blockClass}`}>
        <div class="vfui-dropdown__trigger"
             ref={triggerRef}
             onMouseenter={triggerMouseEnter}
             onMouseleave={triggerMouseLeave}
             onClick={triggerClick}
        >
          <VfuiDropdownTriggerProvider useValue={triggerProviderValue}>
            {props.children}
          </VfuiDropdownTriggerProvider>
        </div>
        <Portal container={portalHost}>
          <VfuiDropdownNestProvider useValue={dropdownNestContext}>
            {
              computedExpanded.value && (
                <div
                  ref={panelRef}
                  data-vfui-popover-owner={ownerPopoverId ?? undefined}
                  className={`vfui-dropdown__panel${animCls}${openCls}${compactMenuCls}${interactiveCls}${themePortalCls}`}
                  style={{
                    top: `${layout.top}px`,
                    left: `${layout.left}px`,
                    zIndex: `${layout.zIndex}`,
                    minWidth: `${layout.minWidth}px`,
                    maxHeight: `${panelMaxHeight}px`,
                  }}
                  role="menu"
                >
                  {props.dropdown}
                </div>
              )
            }
          </VfuiDropdownNestProvider>
        </Portal>
      </div>
    )
  }
}

export type {
  DropdownHorizontalAlign,
  DropdownHorizontalPanelAlign,
  DropdownOrientation,
  DropdownProps,
  DropdownTrigger,
  DropdownVerticalPanelAlign,
} from './dropdown-types'
