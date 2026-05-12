import { computed, JSXNode } from '@viewfly/core'
import { createSignal } from '@viewfly/core'
import { IconGlyph } from '@viewfly/ui-icons'
import type { ClassNames } from '@viewfly/core'
import { Dropdown } from '../dropdown/Dropdown'
import { MenuItem, MenuList, type MenuItemDensity } from '../menu'
import './style.scss'

export interface SelectOptionItem {
  value: string
  label: JSXNode
  disabled?: boolean
}

export type SelectSize = 'small' | 'middle' | 'large'

export interface SelectProps {
  /** 选项列表 */
  options: SelectOptionItem[]
  /** 受控：当前选中项的 `value` */
  value?: string
  /** 非受控初始值 */
  defaultValue?: string
  /** 选中变化 */
  onChange?: (value: string) => void
  disabled?: boolean
  /** 未选中或没有匹配项时的占位；不传则无占位文案 */
  placeholder?: string
  size?: SelectSize
  /** 下拉选项行密度，与 `MenuItem` 一致 */
  optionDensity?: MenuItemDensity
  /** 下拉项使用列紧凑布局（联动 `Dropdown` + `MenuList`） */
  menuColumnCompact?: boolean
  /** 块级宽度 */
  block?: boolean
  class?: ClassNames
  /** 下拉层挂载节点，与 `Dropdown` 一致 */
  getContainer?: () => HTMLElement
}

export function Select(props: SelectProps) {
  const uncontrolled = createSignal<string | undefined>(props.defaultValue)
  const selected = computed(() =>
    props.value !== undefined ? props.value : uncontrolled(),
  )
  const closeTick = createSignal(0)
  const listOpen = createSignal(false)
  const listboxId = `vfui-sel-${Math.random().toString(36).slice(2, 11)}`

  const commit = (next: string) => {
    if (props.value === undefined) {
      uncontrolled.set(next)
    }
    props.onChange?.(next)
    closeTick.set(closeTick() + 1)
  }

  const onOpenChange = (open: boolean) => {
    listOpen.set(open)
  }

  return () => {
    const {
      options,
      disabled = false,
      placeholder,
      block = false,
      optionDensity = 'compact',
      menuColumnCompact = true,
      size = 'middle',
      class: rootClass,
      getContainer,
    } = props

    const current = selected.value
    const active = options.find((o) => o.value === current)
    const hasSelection = active != null

    const sizeMod = size === 'middle' ? '' : ` vfui-select--size-${size}`
    const blockMod = block ? ' vfui-select--block' : ''
    const disabledMod = disabled ? ' vfui-select--disabled' : ''
    const rootCls = `vfui-select${sizeMod}${blockMod}${disabledMod}`
    const chevronSize = size === 'small' ? 12 : size === 'large' ? 16 : 14

    const open = listOpen()

    const panel = (
      <MenuList role="listbox" id={listboxId} columnCompact={menuColumnCompact}>
        {options.map((opt) => {
          const isSelected = opt.value === current
          const optDisabled = opt.disabled ?? false
          return (
            <MenuItem
              key={opt.value}
              role="option"
              density={optionDensity}
              selected={isSelected}
              disabled={optDisabled}
              onClick={() => {
                if (optDisabled) return
                commit(opt.value)
              }}
            >
              {opt.label}
            </MenuItem>
          )
        })}
      </MenuList>
    )

    return (
      <div class={[rootCls, rootClass]}>
        <Dropdown
          trigger="click"
          disabled={disabled}
          closeTick={closeTick}
          onOpenChange={onOpenChange}
          getContainer={getContainer}
          verticalPanelAlign="left"
          menuColumnCompact={menuColumnCompact}
          dropdown={panel}
        >
          <div
            class="vfui-select__control"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-haspopup="listbox"
            aria-disabled={disabled ? true : undefined}
            tabIndex={disabled ? -1 : 0}
          >
            <span
              class={
                hasSelection ? 'vfui-select__value' : 'vfui-select__value vfui-select__value--placeholder'
              }
            >
              {hasSelection ? active.label : placeholder}
            </span>
            <span class="vfui-select__chevron" aria-hidden="true">
              <IconGlyph name="arrow-bottom" size={chevronSize} class="vfui-select__chevron-icon" />
            </span>
          </div>
        </Dropdown>
      </div>
    )
  }
}
