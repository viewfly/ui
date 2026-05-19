import { DROPDOWN_VERTICAL_SWITCH_THRESHOLD, DROPDOWN_VIEWPORT_EDGE } from './dropdown-constants'
import type {
  DropdownHorizontalAlign,
  DropdownHorizontalPanelAlign,
  DropdownOrientation,
  DropdownVerticalPanelAlign,
} from './dropdown-types'

export interface DropdownLayoutPatch {
  top: number
  left: number
  minWidth: number
  maxHeight: number
  placement: 'top' | 'bottom' | 'left' | 'right'
}

export function computeDropdownLayout(args: {
  /** 触发器根节点（`.vfui-dropdown__trigger`）的 `getBoundingClientRect()`，视口坐标 */
  triggerRect: DOMRect
  /**
   * 已挂载的面板 DOM（`.vfui-dropdown__panel`）；首帧可能为 `null`。
   * 用于读 `offsetWidth` / `offsetHeight` / `scrollHeight` 参与翻面与对齐；未挂载时用触发器宽高等兜底。
   */
  panelElement: HTMLElement | null
  /**
   * 触发器与面板之间的间距（px）。
   * 纵向：`top`/`bottom` 放置时在触发器上/下缘外再留 `gap`；横向：`left`/`right` 时在左右缘外留 `gap`。
   */
  gap: number
  /** `vertical`：优先上下弹出；`horizontal`：优先左右弹出 */
  orientation: DropdownOrientation
  /**
   * 横向弹出时优先一侧：`left` 优先在触发器左侧，`right` 优先右侧；该侧空间不足时换边。
   * 仅 `orientation === 'horizontal'` 时有效；未传时实现内通常当作 `left`。
   */
  horizontalAlign?: DropdownHorizontalAlign
  /**
   * 横向弹出时，面板与触发器在垂直方向的对齐：`top` | `middle` | `bottom`。
   * 未传时：根级默认 `top`，嵌套子菜单默认 `middle`。仅横向有效。
   */
  horizontalPanelAlign?: DropdownHorizontalPanelAlign
  /**
   * 纵向弹出时，面板与触发器在水平方向的对齐：`left` | `center` | `right`。
   * 未传时通常当作 `left`。仅纵向有效。
   */
  verticalPanelAlign?: DropdownVerticalPanelAlign
  /**
   * 横向弹出时，返回「参考顶」元素；面板上沿不得低于该元素上沿（视口 `top`），并与视口上边距取较大值。
   * 返回 `null` 时不做参考顶限制。仅本层 `Dropdown` 传入的 getter 生效，不继承父级。
   */
  getHorizontalTopMinFrom?: () => HTMLElement | null
  /** 视口高度（px），通常 `window.innerHeight` */
  vh: number
  /**
   * 输出写入此对象（可变 patch）：`top`、`left`、`minWidth`、`maxHeight`、`placement`。
   * 调用前可保留上次 `placement`，用于横向已打开时「粘住」左右侧避免滚动翻面。
   */
  layout: DropdownLayoutPatch
  /**
   * 业务侧 `props.maxHeight` 上限（默认 400），与视口算出的 `layout.maxHeight` 在 `Dropdown` 渲染时再取 `min`。
   * 布局内用于纵向翻面、有效面板高度估算，应与最终 style `maxHeight` 同一量级。
   */
  panelMaxHeightCap?: number
}): void {
  const {
    /** 触发器视口矩形，下文别名 `r` */
    triggerRect,
    /** 面板元素；未挂载时为 `null` */
    panelElement,
    /** 触发器与面板间距（px） */
    gap,
    /** 弹出主轴：`vertical` | `horizontal` */
    orientation,
    /** 横向优先侧  */
    horizontalAlign = 'right',
    /** 横向时面板相对触发器的垂直对齐 */
    horizontalPanelAlign = 'middle',
    /** 纵向时面板相对触发器的水平对齐 */
    verticalPanelAlign = 'left',
    /** 横向参考顶元素 getter（可选） */
    getHorizontalTopMinFrom,
    // /** 是否为嵌套子菜单 */
    // isNestedInParentDropdown,
    // /** 视口宽 */
    // vw,
    /** 视口高 */
    vh,
    /** 写入定位结果的 reactive / patch 对象 */
    layout,
    /** `props.maxHeight` 上限，默认 400 */
    panelMaxHeightCap = 400,
  } = args

  if (!panelElement) {
    return
  }

  const pad = DROPDOWN_VIEWPORT_EDGE

  const panelRect = panelElement.getBoundingClientRect()

  if (orientation === 'horizontal') {
    if (horizontalAlign === 'left' && triggerRect.left >= panelRect.width + pad + gap) {
      layout.placement = 'left'
      layout.left = triggerRect.left - gap - panelRect.width
    } else {
      layout.placement = 'right'
      layout.left = triggerRect.right + gap
    }

    let minTop = Math.min(triggerRect.top, pad)

    const limitRect = getHorizontalTopMinFrom?.()?.getBoundingClientRect()
    if (limitRect) {
      minTop = Math.max(limitRect.top, minTop)
    }

    const hSpace = Math.max(vh - pad, triggerRect.bottom) - minTop

    let panelHeight = Math.min(panelMaxHeightCap, panelElement.scrollHeight)

    if (panelHeight > hSpace) {
      panelHeight = Math.max(DROPDOWN_VERTICAL_SWITCH_THRESHOLD, hSpace)
    }

    layout.maxHeight = panelHeight

    if (horizontalPanelAlign === 'top') {
      layout.top = Math.max(minTop,
        triggerRect.bottom - layout.maxHeight,
        Math.min(
          triggerRect.top,
          vh - pad - layout.maxHeight
        )
      )
    } else if (horizontalPanelAlign === 'bottom') {
      layout.top = Math.max(minTop,
        triggerRect.bottom - layout.maxHeight,
        Math.min(
          triggerRect.bottom - layout.maxHeight,
          vh - pad - layout.maxHeight
        )
      )
    } else {
      layout.top = Math.max(minTop,
        triggerRect.bottom - layout.maxHeight,
        Math.min(
          triggerRect.top + triggerRect.height / 2 - layout.maxHeight / 2,
          vh - pad - layout.maxHeight
        )
      )
    }
  } else {
    const topSpace = triggerRect.top - gap - pad
    const bottomSpace = vh - triggerRect.bottom - gap - pad

    if (bottomSpace >= topSpace || bottomSpace >= DROPDOWN_VERTICAL_SWITCH_THRESHOLD) {
      layout.placement = 'bottom'
      layout.maxHeight = Math.min(bottomSpace, panelElement.scrollHeight, panelMaxHeightCap)
      layout.top = triggerRect.bottom + gap
    } else {
      layout.placement = 'top'
      layout.maxHeight = Math.min(topSpace, panelElement.scrollHeight, panelMaxHeightCap)
      layout.top = triggerRect.top - gap - layout.maxHeight
    }
    if (verticalPanelAlign === 'right') {
      layout.left = triggerRect.right - panelRect.width
    } else if (verticalPanelAlign === 'center') {
      layout.left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2
    } else {
      layout.left = triggerRect.left
    }

    layout.minWidth = triggerRect.width
  }
}
