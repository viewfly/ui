import type { JSXNode } from '@viewfly/core'
import { createDerived, createSignal } from '@viewfly/core'
import type { ClassNames } from '@viewfly/core'
import type { VfuiTabsContext, VfuiTabsOrientation } from './context'
import { VfuiTabsProvider } from './context'
import './style.scss'

export interface TabsProps {
  /** 受控：当前激活的 `value`（与子级 `Tab` / `TabPanel` 的 `value` 对应） */
  value?: string
  /** 非受控时的初始激活项 */
  defaultValue?: string
  /** 切换面板时触发 */
  onChange?: (value: string) => void
  /** 是否禁用所有标签（单个 `Tab` 仍可再设 `disabled`） */
  disabled?: boolean
  /** 标签排列方向；`vertical` 时标签列在左侧 */
  orientation?: VfuiTabsOrientation
  children?: JSXNode
  class?: ClassNames
}

export function Tabs(props: TabsProps) {
  const idPrefix = `vfui-tabs-${Math.random().toString(36).slice(2, 11)}`
  const uncontrolled = createSignal(props.defaultValue ?? '')

  const selected = createDerived(() =>
    props.value !== undefined ? props.value : uncontrolled(),
  )

  const disabledSig = createDerived(() => props.disabled ?? false)

  const orientationSig = createDerived(() => props.orientation ?? 'horizontal')

  const select = (v: string) => {
    if (props.value === undefined) {
      uncontrolled.set(v)
    }
    props.onChange?.(v)
  }

  const ctx: VfuiTabsContext = {
    selected,
    select,
    disabled: disabledSig,
    orientation: orientationSig,
    idPrefix,
  }

  return () => {
    const { class: rootClass, children } = props
    const orient = orientationSig()
    const orientMod = orient === 'vertical' ? ' vfui-tabs--vertical' : ''
    const baseCls = `vfui-tabs${orientMod}`

    return (
      <VfuiTabsProvider useValue={ctx}>
        <div class={[baseCls, rootClass]}>{children}</div>
      </VfuiTabsProvider>
    )
  }
}
