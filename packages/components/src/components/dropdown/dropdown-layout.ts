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
  /** 与面板 `maxHeight` 上限一致；用于「上下都放不下完整高度」时计算贴齐触发器的有效高度 */
  panelMaxHeightCap?: number
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
    panelMaxHeightCap = 400,
  } = args

  const pad = DROPDOWN_VIEWPORT_EDGE
  const relaxViewportClamp = !triggerFullyInViewport(r, vw, vh)

  // 内容固有高度（未扣 maxHeight）；横向对齐等仍参考完整占位需求
  const panelIntrinsicH = panelElement
    ? Math.max(panelElement.offsetHeight, panelElement.scrollHeight)
    : 0
  const panelW = panelElement?.offsetWidth ?? r.width
  const effW = Math.max(panelW, r.width)
  const effH = Math.max(panelIntrinsicH, 1)
  // 纵向弹出：翻面 / 定 top 时按「实际不会超过 props.maxHeight（默认 400）」的高度算，
  // 否则向上弹出时用 scrollHeight 会把 top 抬得太高，与后续 style maxHeight 裁剪不一致。
  const panelHVertical =
    panelIntrinsicH > 0 ? Math.min(panelIntrinsicH, panelMaxHeightCap) : 0

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
    const hForAlign = panelIntrinsicH > 0 ? panelIntrinsicH : effH

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
    // 视口内可用竖直区间 [vTop, vBottom]；锚点相对于触发器，用于判断「整块面板是否真正落在视口内」
    const vTop = pad
    const vBottom = vh - pad
    const anchorTop = r.top - gap // 向上展开时面板底边
    const anchorBottom = r.bottom + gap // 向下展开时面板顶边

    // 整块落在视口内才视为 fits，避免触发器滚出视口后仍用夸大的 spaceAbove 误判 fitsAbove，把面板「贴」进可视区上半
    const fitsBelow =
      panelHVertical <= 0 ||
      (anchorBottom >= vTop && anchorBottom + panelHVertical <= vBottom)
    const fitsAbove =
      panelHVertical > 0 && anchorTop <= vBottom && anchorTop - panelHVertical >= vTop

    // 冲突分支用的「可见侧剩余空间」：锚点在视口外该侧时为 0，避免误判翻面
    let spaceBelow = Math.max(0, vBottom - anchorBottom)
    let spaceAbove = Math.max(0, anchorTop - vTop)
    if (anchorTop > vBottom) spaceAbove = 0
    if (anchorBottom < vTop) spaceBelow = 0

    if (panelHVertical > 0) {
      if (fitsBelow) {
        placement = 'bottom'
        top = r.bottom + gap
      } else if (spaceBelow >= DROPDOWN_VERTICAL_SWITCH_THRESHOLD) {
        // 整块放不下时：只要下方剩余不低于最小可用高度，仍优先向下（靠 maxHeight 裁切 + 内部滚动），避免过早改向上弹出
        placement = 'bottom'
        top = r.bottom + gap
      } else if (fitsAbove) {
        placement = 'top'
        const maxHAbove = Math.max(0, r.top - gap - pad)
        const hOpen = Math.min(panelHVertical, maxHAbove)
        top = r.top - gap - hOpen
      } else {
        // 上下都放不全：下方空间 ≥ 阈值则优先下方；否则比较上下可见空间；两侧都为 0 时保持当前侧（跟按钮滚出视口仍朝上展示）
        const currentVerticalPlacement = layout.placement === 'top' ? 'top' : 'bottom'
        const bottomEnough = spaceBelow >= DROPDOWN_VERTICAL_SWITCH_THRESHOLD
        let nextVerticalPlacement: 'top' | 'bottom'
        if (spaceAbove === 0 && spaceBelow === 0) {
          nextVerticalPlacement = currentVerticalPlacement
        } else if (bottomEnough) {
          nextVerticalPlacement = 'bottom'
        } else {
          nextVerticalPlacement = spaceAbove > spaceBelow ? 'top' : 'bottom'
        }
        const shouldSwitch = nextVerticalPlacement !== currentVerticalPlacement

        placement = shouldSwitch ? nextVerticalPlacement : currentVerticalPlacement
        if (placement === 'top') {
          const maxHAbove = Math.max(0, r.top - gap - pad)
          const clampedH = Math.min(panelHVertical, maxHAbove)
          top = r.top - gap - clampedH
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
    // 纵向弹出：水平方向同样跟随触发器，避免滚出视口时被夹到窗口侧边导致「脱离」按钮
  }

  layout.top = top
  layout.left = left
  layout.minWidth = r.width
  // maxHeight：开口方向上的可用空间；负值表示锚点已离开视口该侧，不压成 0（否则条塌掉），用 vh 作上限交给外层 min(props.maxHeight)
  const rawAbove = r.top - gap - pad
  const rawBelow = vh - pad - top
  if (placement === 'top') {
    layout.maxHeight = rawAbove > 0 ? Math.min(rawAbove, vh - 2 * pad) : Math.max(0, vh - 2 * pad)
  } else if (placement === 'bottom') {
    layout.maxHeight = rawBelow > 0 ? Math.min(rawBelow, vh - 2 * pad) : Math.max(0, vh - 2 * pad)
  } else {
    // 横向 left/right：触发器整体在视口上/下方时，不要用「相对视口留 10px」去限高；压矮 offsetHeight 会破坏底对齐等纵向贴合。
    const triggerBelowViewport = r.top >= vh
    const triggerAboveViewport = r.bottom <= 0
    if (triggerBelowViewport || triggerAboveViewport) {
      layout.maxHeight = panelMaxHeightCap
    } else {
      layout.maxHeight = Math.max(0, vh - 2 * pad)
    }
  }
  layout.placement = placement
}
