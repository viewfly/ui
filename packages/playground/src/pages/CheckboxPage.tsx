import { createSignal } from '@viewfly/core'
import { Checkbox } from '@viewfly/ui-components'

export function CheckboxPage() {
  const controlled = createSignal(false)

  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Checkbox</h2>

      <section class="mb-8 flex flex-wrap items-center gap-4">
        <h3 class="text-sm font-medium vfui-text-muted w-full">默认（非受控）</h3>
        <Checkbox defaultChecked />
        <Checkbox />
      </section>

      <section class="mb-8 flex flex-wrap items-center gap-4">
        <h3 class="text-sm font-medium vfui-text-muted w-full">带文案</h3>
        <Checkbox defaultChecked>同意服务条款</Checkbox>
        <Checkbox>订阅更新（可选）</Checkbox>
      </section>

      <section class="mb-8 flex flex-wrap items-center gap-4">
        <h3 class="text-sm font-medium vfui-text-muted w-full">受控</h3>
        <Checkbox checked={controlled()} onChange={(v) => controlled.set(v)}>
          受控选项
        </Checkbox>
        <span class="text-sm vfui-text-muted">当前：{controlled() ? '已选' : '未选'}</span>
      </section>

      <section class="mb-8 flex flex-wrap items-center gap-4">
        <h3 class="text-sm font-medium vfui-text-muted w-full">禁用</h3>
        <Checkbox defaultChecked disabled>
          禁用已选
        </Checkbox>
        <Checkbox disabled>禁用未选</Checkbox>
      </section>

      <p class="text-xs vfui-text-muted">使用原生 checkbox，支持键盘聚焦与 Space 切换，可配合 name / value 用于表单。</p>
    </div>
  )
}
