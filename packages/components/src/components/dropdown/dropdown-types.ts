import type { JSXNode, Signal } from '@viewfly/core'

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
  open?: boolean
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
