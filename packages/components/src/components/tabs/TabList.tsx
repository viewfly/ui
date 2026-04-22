import type { JSXNode } from '@viewfly/core'
import { inject } from '@viewfly/core'
import type { ClassNames } from '@viewfly/core'
import { VfuiTabsToken } from './context'
import './style.scss'

export interface TabListProps {
  children?: JSXNode
  class?: ClassNames
}

export function TabList(props: TabListProps) {
  const tabsCtx = inject(VfuiTabsToken, null)

  return () => {
    if (!tabsCtx) {
      console.warn('[ViewflyUI] TabList must be used inside Tabs.')
      return null
    }

    const { class: listClass, children } = props
    const orient = tabsCtx.orientation()
    const baseCls = 'vfui-tabs__tablist'

    const selectAndFocus = (el: HTMLButtonElement | null | undefined) => {
      if (!el) return
      const v = el.getAttribute('data-vfui-tab-value')
      if (v) tabsCtx.select(v)
      queueMicrotask(() => el.focus())
    }

    const moveSelection = (root: HTMLElement, from: HTMLButtonElement, delta: number) => {
      const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('button[role="tab"]')).filter(
        (node) => !node.disabled,
      )
      if (tabs.length === 0) return
      const i = tabs.indexOf(from)
      if (i < 0) return
      const next = (i + delta + tabs.length) % tabs.length
      selectAndFocus(tabs[next])
    }

    const moveToEdge = (root: HTMLElement, edge: 'first' | 'last') => {
      const tabs = Array.from(
        root.querySelectorAll<HTMLButtonElement>('button[role="tab"]:not([disabled])'),
      )
      const el = edge === 'first' ? tabs[0] : tabs[tabs.length - 1]
      selectAndFocus(el)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (!t || t.getAttribute('role') !== 'tab') return
      const btn = t as HTMLButtonElement
      const root = e.currentTarget as HTMLElement

      if (orient === 'horizontal') {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          moveSelection(root, btn, 1)
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          moveSelection(root, btn, -1)
        } else if (e.key === 'Home') {
          e.preventDefault()
          moveToEdge(root, 'first')
        } else if (e.key === 'End') {
          e.preventDefault()
          moveToEdge(root, 'last')
        }
      } else {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          moveSelection(root, btn, 1)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          moveSelection(root, btn, -1)
        } else if (e.key === 'Home') {
          e.preventDefault()
          moveToEdge(root, 'first')
        } else if (e.key === 'End') {
          e.preventDefault()
          moveToEdge(root, 'last')
        }
      }
    }

    return (
      <div
        class={[baseCls, listClass]}
        role="tablist"
        aria-orientation={orient === 'vertical' ? 'vertical' : 'horizontal'}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    )
  }
}
