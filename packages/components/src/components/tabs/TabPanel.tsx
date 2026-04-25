import type { JSXNode } from '@viewfly/core'
import { inject } from '@viewfly/core'
import type { ClassNames } from '@viewfly/core'
import { VfuiTabsToken } from './context'
import './style.scss'

export interface TabPanelProps {
  value: string
  children?: JSXNode
  class?: ClassNames
}

export function TabPanel(props: TabPanelProps) {
  const tabsCtx = inject(VfuiTabsToken, null)

  return () => {
    if (!tabsCtx) {
      console.warn('[ViewflyUI] TabPanel must be used inside Tabs.')
      return null
    }

    const { value, children, class: panelClass } = props
    const active = tabsCtx.selected.value === value
    const tabId = `${tabsCtx.idPrefix}-tab-${value}`
    const panelId = `${tabsCtx.idPrefix}-panel-${value}`

    const base = 'vfui-tabs__panel'
    const activeMod = active ? ' vfui-tabs__panel--active' : ''
    const baseCls = `${base}${activeMod}`

    return (
      <div
        class={[baseCls, panelClass]}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        hidden={!active}
      >
        {children}
      </div>
    )
  }
}
