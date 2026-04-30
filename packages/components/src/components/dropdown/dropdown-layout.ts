import { DROPDOWN_VERTICAL_SWITCH_THRESHOLD, DROPDOWN_VIEWPORT_EDGE } from './dropdown-constants'
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
  maxHeight: number
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

  // 使用内容固有高度参与放置判断，避免 maxHeight 生效后以“当前裁剪高度”反复决策造成抖动
  const panelH = panelElement
    ? Math.max(panelElement.offsetHeight, panelElement.scrollHeight)
    : 0
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
    const refEl = getHorizontalTopMinFrom?.()
    // 横向弹出在滚动过程中始终使用同一套 top 夹紧逻辑，避免跳变。
    // 默认以触发器为参考；若提供 getHorizontalTopMinFrom 则改用该参考元素。
    // - 向上最多到「面板底边 = 参考元素底边」（top = ref.bottom - panelH）
    // - 向下最多到「面板顶边 = 参考元素顶边」（top = ref.top）
    // 再与视口边界共同夹紧，确保不越界。
    const refRect = refEl?.getBoundingClientRect() ?? r
    let minTop = pad
    let maxTop = vh - pad - hForAlign
    minTop = Math.max(minTop, refRect.bottom - hForAlign)
    maxTop = Math.min(maxTop, refRect.top)
    if (minTop <= maxTop) {
      top = Math.min(maxTop, Math.max(top, minTop))
    } else {
      // 夹紧区间倒挂时选择更接近当前 top 的边界，避免突兀跳跃。
      top = Math.abs(top - minTop) <= Math.abs(top - maxTop) ? minTop : maxTop
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
        // 上下都放不全时采用「下方优先」：
        // - 下方可用高度 >= 阈值：强制放下方（可从 top 回切）
        // - 下方可用高度 < 阈值：仅在上方空间更大时放上方
        const currentVerticalPlacement = layout.placement === 'top' ? 'top' : 'bottom'
        const bottomEnough = spaceBelow >= DROPDOWN_VERTICAL_SWITCH_THRESHOLD
        const nextVerticalPlacement = bottomEnough
          ? 'bottom'
          : (spaceAbove > spaceBelow ? 'top' : 'bottom')
        const shouldSwitch = nextVerticalPlacement !== currentVerticalPlacement

        placement = shouldSwitch ? nextVerticalPlacement : currentVerticalPlacement
        if (placement === 'top') {
          placement = 'top'
          top = pad
        } else {
          placement = 'bottom'
          top = r.bottom + gap
        }
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
  if (placement === 'top') {
    layout.maxHeight = Math.max(0, r.top - gap - pad)
  } else {
    layout.maxHeight = Math.max(0, vh - pad - top)
  }
  layout.placement = placement
}
