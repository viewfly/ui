import { Divider } from '@viewfly/ui-components'

export function DividerPage() {
  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Divider</h2>

      <section class="mb-8">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">水平</h3>
        <p class="text-sm text-gray-600 dark:text-slate-400 mb-3">默认实线</p>
        <Divider />
        <p class="text-sm text-gray-600 dark:text-slate-400 mt-6 mb-3">虚线 + plain（更紧凑）</p>
        <Divider dashed plain />
      </section>

      <section class="mb-8">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">带文案</h3>
        <Divider>居中</Divider>
        <div class="h-4" />
        <Divider textAlign="start">靠左</Divider>
        <div class="h-4" />
        <Divider textAlign="end">靠右</Divider>
        <div class="h-4" />
        <Divider dashed>虚线文案</Divider>
      </section>

      <section class="mb-8">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">垂直（flex 行内）</h3>
        <div class="flex items-center gap-2 h-10 text-sm text-gray-800 dark:text-slate-200">
          <span>左侧</span>
          <Divider direction="vertical" />
          <span>中间</span>
          <Divider direction="vertical" dashed />
          <span>右侧</span>
        </div>
      </section>
    </div>
  )
}
