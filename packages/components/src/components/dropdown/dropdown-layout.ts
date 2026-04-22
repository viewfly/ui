import { DROPDOWN_VIEWPORT_EDGE } from './dropdown-constants'
import type {
  DropdownHorizontalAlign,
  DropdownHorizontalPanelAlign,
  DropdownOrientation,
  DropdownVerticalPanelAlign,
} from './dropdown-types'

/** 触发器是否完全落在视口内；否则不再为「塞满视口」夹紧面板，仅保持与触发器的 gap（类原生 select） */
export function triggerFullyInViewport(r: DOMRect, vw: number, vh: number): boolean {
  return r.top >= 0 && r.left >= 0 && r.bottom <= vh && r.right <= vw
}

export interface DropdownLayoutPatch {
  top: number
  left: number
  minWidth: number
  placement: 'top' | 'bottom' | 'left' | 'right'
}

export function computeDropdownLayout(args: {
  triggerRect: DOMRect
  panelElement: HTMLElement | null
  gap: number
  orientation: DropdownOrientation
  horizontalAlign?: DropdownHorizontalAlign
  horizontalPanelAlign?: DropdownHorizontalPanelAlign
  verticalPanelAlign?: DropdownVerticalPanelAlign
  getHorizontalTopMinFrom?: () => HTMLElement | null
  /** 嵌在另一 Dropdown 面板内（子菜单） */
  isNestedInParentDropdown: boolean
  vw: number
  vh: number
  layout: DropdownLayoutPatch
}): void {
  const {
    triggerRect: r,
    panelElement,
    gap,
    orientation,
    horizontalAlign: preferAlign,
    horizontalPanelAlign,
    verticalPanelAlign,
    getHorizontalTopMinFrom,
    isNestedInParentDropdown,
    vw,
    vh,
    layout,
  } = args

  const pad = DROPDOWN_VIEWPORT_EDGE
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
    const prefer = preferAlign ?? 'left'
    const vAlign = horizontalPanelAlign ?? (isNestedInParentDropdown ? 'middle' : 'top')
    const hForAlign = panelH > 0 ? panelH : effH

    if (vAlign === 'top') {
      top = r.top
    } else if (vAlign === 'middle') {
      top = r.top + (r.height - hForAlign) / 2
    } else {
      top = r.bottom - hForAlign
    }
    const maxTop = vh - pad - hForAlign
    const refEl = getHorizontalTopMinFrom?.()
    if (relaxViewportClamp) {
      if (refEl != null) {
        top = Math.max(top, refEl.getBoundingClientRect().top)
      }
    } else {
      const floorTop = refEl != null ? Math.max(pad, refEl.getBoundingClientRect().top) : pad
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

    const hAlign = verticalPanelAlign ?? 'left'
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
