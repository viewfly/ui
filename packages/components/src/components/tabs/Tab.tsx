import type { JSXNode } from '@viewfly/core'
import { inject } from '@viewfly/core'
import type { ClassNames } from '@viewfly/core'
import { VfuiTabsToken } from './context'
import './style.scss'

export interface TabProps {
  /** 与对应 `TabPanel` 的 `value` 一致，并在 `Tabs` 的 `value` / `defaultValue` 中使用 */
  value: string
  disabled?: boolean
  children?: JSXNode
  class?: ClassNames
}

export function Tab(props: TabProps) {
  const tabsCtx = inject(VfuiTabsToken, null)

  return () => {
    if (!tabsCtx) {
      console.warn('[ViewflyUI] Tab must be used inside Tabs.')
      return null
    }

    const { value, disabled: tabDisabled = false, children, class: tabClass } = props
    const groupDisabled = tabsCtx.disabled.value
    const disabled = groupDisabled || tabDisabled
    const selected = tabsCtx.selected.value === value
    const tabId = `${tabsCtx.idPrefix}-tab-${value}`
    const panelId = `${tabsCtx.idPrefix}-panel-${value}`

    const base = 'vfui-tabs__tab'
    const activeMod = selected ? ' vfui-tabs__tab--active' : ''
    const disMod = disabled ? ' vfui-tabs__tab--disabled' : ''
    const baseCls = `${base}${activeMod}${disMod}`

    return (
      <button
        type="button"
        class={[baseCls, tabClass]}
        role="tab"
        id={tabId}
        data-vfui-tab-value={value}
        aria-selected={selected}
        aria-controls={panelId}
        tabIndex={selected ? 0 : -1}
        disabled={disabled}
        onClick={() => {
          if (disabled) return
          tabsCtx.select(value)
        }}
      >
        {children}
      </button>
    )
  }
}
