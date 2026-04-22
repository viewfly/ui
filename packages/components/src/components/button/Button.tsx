import type { JSXNode } from '@viewfly/core'
import { inject } from '@viewfly/core'
import { IconGlyph } from '@viewfly/ui-icons'
import type { ClassNames } from '@viewfly/core'
import { VfuiDropdownTriggerToken } from '../dropdown/trigger-context'
import './style.scss'

export type ButtonVariant = 'solid' | 'outlined' | 'dashed' | 'filled' | 'text' | 'link'

export type ButtonSize = 'small' | 'middle' | 'large'

export type ButtonShape = 'default' | 'circle' | 'round'

export type ButtonHtmlType = 'button' | 'submit' | 'reset'

export type ButtonIconPosition = 'start' | 'end'

export interface ButtonProps {
  /** 语义色（与原生 `button` 的 `type` 无关；表单 submit/reset 请用 `htmlType`） */
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** 视觉变体；`solid` 为默认填充，与常见组件库一致 */
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  /** 原生 `type`，仅用于 `<button>`；`variant="link"` 且提供 `href` 时渲染为 `<a>`，此属性无效 */
  htmlType?: ButtonHtmlType
  /** `variant="link"` 且提供 `href` 时渲染为 `<a>`，用于导航 */
  href?: string
  /** 与 `href` 一并用于 `<a target="...">` */
  target?: string
  /** 显式 `rel`；未传且 `target="_blank"` 时默认 `noopener noreferrer` */
  rel?: string
  /**
   * 高亮：仅在 `variant="text"` 且 `type="default"`（属性可省略）时生效，文案改为主色，
   * 适合「查询/筛选等条件为真」时的强调。其它变体传入时忽略。禁用时无效果。
   */
  highlighted?: boolean
  /** 展示加载中状态；为真时会禁用按钮并显示转圈 */
  loading?: boolean
  /** 左侧或右侧图标（`loading` 为真时不展示，由转圈替代起始位） */
  icon?: JSXNode
  /** `icon` 相对文案的位置，默认 `start` */
  iconPosition?: ButtonIconPosition
  /**
   * 是否在文案末尾展示下拉式下箭头。
   * 未传且位于 `Dropdown` 触发区内时默认为展示；显式 `false` 可关闭。
   */
  chevronDown?: boolean
  /**
   * 在展示下箭头（`chevronDown` 为真或处于 `Dropdown` 触发区）时，使文案与箭头之间无额外空隙；
   * `iconPosition="end"` 的图标与箭头同组，三者之间也无空隙。默认 `false`，沿用根节点 `gap`。
   */
  chevronGapless?: boolean
  /** 块级宽度（`width: 100%`） */
  block?: boolean
  /**
   * 为 true 时缩小左右内边距，适合作为下拉、分段控件里的「紧凑」按钮，与默认纵向高度体系（size）一致。
   */
  inlineCompact?: boolean
  /** 追加到根节点 `class` */
  class?: ClassNames
  disabled?: boolean
  onClick?: () => void
  children?: JSXNode
}

export function Button(props: ButtonProps) {
  const dropdownTrigger = inject(VfuiDropdownTriggerToken, null)

  return () => {
    const {
      type = 'default',
      variant = 'solid',
      size = 'middle',
      shape = 'default',
      htmlType = 'button',
      href,
      target,
      rel,
      highlighted = false,
      loading = false,
      icon,
      iconPosition = 'start',
      chevronDown,
      chevronGapless = false,
      block = false,
      inlineCompact = false,
      class: rootClass,
      disabled = false,
      onClick,
      children,
    } = props

    const sizeMod = size === 'middle' ? '' : ` vfui-button--size-${size}`
    const shapeMod = shape === 'default' ? '' : ` vfui-button--shape-${shape}`
    const loadingMod = loading ? ' vfui-button--loading' : ''
    const inactive = disabled || loading
    const highlightedMod =
      highlighted && !inactive && variant === 'text' && type === 'default' ? ' vfui-button--highlighted' : ''
    const blockMod = block ? ' vfui-button--block' : ''
    const inlineCompactMod = inlineCompact ? ' vfui-button--inline-compact' : ''

    const showStartIcon = !loading && icon && iconPosition === 'start'
    const showEndIcon = !loading && icon && iconPosition === 'end'

    const showChevronDown =
      chevronDown === true || (chevronDown !== false && dropdownTrigger != null)

    const chevronSize = size === 'small' ? 12 : size === 'large' ? 16 : 14

    const className = `vfui-button vfui-button--${type} vfui-button--variant-${variant}${sizeMod}${shapeMod}${loadingMod}${highlightedMod}${blockMod}${inlineCompactMod}`

    const chevronEl = showChevronDown ? (
      <span class="vfui-button__chevron" aria-hidden="true">
        <IconGlyph name="arrow-bottom" size={chevronSize} class="vfui-button__chevron-icon" />
      </span>
    ) : null

    const useChevronTrail = showChevronDown && chevronGapless

    const body = useChevronTrail ? (
      <>
        {loading ? <span class="vfui-button__spinner" aria-hidden="true" /> : null}
        {showStartIcon ? <span class="vfui-button__icon">{icon}</span> : null}
        <span class="vfui-button__trail">
          {children}
          {showEndIcon ? <span class="vfui-button__icon">{icon}</span> : null}
          {chevronEl}
        </span>
      </>
    ) : (
      <>
        {loading ? <span class="vfui-button__spinner" aria-hidden="true" /> : null}
        {showStartIcon ? <span class="vfui-button__icon">{icon}</span> : null}
        {children}
        {showEndIcon ? <span class="vfui-button__icon">{icon}</span> : null}
        {chevronEl}
      </>
    )

    if (variant === 'link' && href) {
      const relResolved = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)
      const handleAnchorClick = (e: MouseEvent) => {
        if (inactive) {
          e.preventDefault()
          return
        }
        onClick?.()
      }

      return (
        <a
          href={href}
          target={target}
          rel={relResolved}
          class={[className, rootClass]}
          aria-busy={loading ? true : undefined}
          aria-disabled={inactive ? true : undefined}
          tabIndex={inactive ? -1 : undefined}
          onClick={handleAnchorClick}
        >
          {body}
        </a>
      )
    }

    return (
      <button
        type={htmlType}
        class={[className, rootClass]}
        disabled={inactive}
        aria-busy={loading ? true : undefined}
        onClick={onClick}
      >
        {body}
      </button>
    )
  }
}
