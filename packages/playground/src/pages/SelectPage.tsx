import { createSignal } from '@viewfly/core'
import { Select } from '@viewfly/ui-components'

const baseOptions = [
  { value: 'bj', label: '北京' },
  { value: 'sh', label: '上海' },
  { value: 'gz', label: '广州' },
  { value: 'sz', label: '深圳', disabled: true },
  { value: 'hz', label: '杭州' },
]

export function SelectPage() {
  const city = createSignal<string | undefined>('sh')

  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Select</h2>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">非受控</h3>
        <p class="text-sm vfui-text-muted mb-4">默认选中「上海」；选中后下拉自动收起。</p>
        <Select defaultValue="sh" options={baseOptions} />
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">受控</h3>
        <p class="text-sm vfui-text-muted mb-4">
          当前：<span class="font-mono text-xs">{city() ?? '（空）'}</span>
        </p>
        <div class="flex flex-wrap items-center gap-4">
          <Select value={city()} options={baseOptions} onChange={(v) => city.set(v)} />
          <button
            type="button"
            class="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/80"
            onClick={() => city.set(undefined)}
          >
            清空
          </button>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">尺寸与块级</h3>
        <div class="flex flex-col gap-4 max-w-md">
          <Select size="small" placeholder="小号" options={baseOptions} />
          <Select size="middle" placeholder="默认中号" options={baseOptions} />
          <Select size="large" placeholder="大号" options={baseOptions} />
          <Select block placeholder="块级宽度" options={baseOptions} />
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">选项紧凑密度</h3>
        <p class="text-sm vfui-text-muted mb-4">
          <code class="text-xs">optionDensity=&quot;compact&quot;</code> 使用与 <code class="text-xs">MenuItem</code> 相同的紧凑行样式。
        </p>
        <div class="max-w-md">
          <Select optionDensity="compact" placeholder="紧凑选项" options={baseOptions} />
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">禁用</h3>
        <Select disabled options={baseOptions} defaultValue="bj" />
      </section>
    </div>
  )
}
