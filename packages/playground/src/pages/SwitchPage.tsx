import { createSignal } from '@viewfly/core'
import { Switch } from '@viewfly/ui-components'

export function SwitchPage() {
  const controlled = createSignal(true)

  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Switch</h2>

      <section class="mb-8 flex flex-wrap items-center gap-4">
        <h3 class="text-sm font-medium vfui-text-muted w-full">默认（非受控）</h3>
        <Switch defaultChecked />
        <Switch />
      </section>

      <section class="mb-8 flex flex-wrap items-center gap-4">
        <h3 class="text-sm font-medium vfui-text-muted w-full">受控</h3>
        <Switch checked={controlled()} onChange={(v) => controlled.set(v)} />
        <span class="text-sm vfui-text-muted">当前：{controlled() ? '开' : '关'}</span>
      </section>

      <section class="mb-8 flex flex-wrap items-center gap-4">
        <h3 class="text-sm font-medium vfui-text-muted w-full">禁用</h3>
        <Switch defaultChecked disabled />
        <Switch disabled />
      </section>

      <p class="text-xs vfui-text-muted">使用原生按钮，支持键盘聚焦与 Space / Enter 触发。</p>
    </div>
  )
}
