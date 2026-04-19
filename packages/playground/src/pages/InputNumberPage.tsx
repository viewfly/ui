import { createSignal } from '@viewfly/core'
import { Button, InputNumber } from '@viewfly/ui-components'

const yuan = <span class="text-xs font-medium text-gray-600 dark:text-slate-400">¥</span>

export function InputNumberPage() {
  const n = createSignal<number | null>(42)

  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">InputNumber</h2>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">非受控</h3>
        <p class="text-sm vfui-text-muted mb-4">初始值 10，步长 1；可直接输入或使用两侧按钮。</p>
        <InputNumber defaultValue={10} min={0} max={100} block />
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">受控</h3>
        <p class="text-sm vfui-text-muted mb-4">
          当前：<span class="font-mono text-xs">{n() === null ? 'null' : String(n())}</span>
        </p>
        <div class="flex flex-wrap items-center gap-4 max-w-md">
          <InputNumber block value={n()} onChange={(v) => n.set(v)} min={0} max={99} step={1} />
          <button
            type="button"
            class="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/80"
            onClick={() => n.set(null)}
          >
            清空
          </button>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">前缀 / 后缀（与 Input 相同的组合样式）</h3>
        <div class="flex flex-col gap-4 max-w-md">
          <InputNumber block prefix={yuan} placeholder="金额" min={0} precision={2} step={0.01} defaultValue={19.9} />
          <InputNumber
            block
            prefix={<span class="text-xs vfui-text-muted">Qty</span>}
            suffix={<span class="text-xs vfui-text-muted">件</span>}
            min={1}
            max={999}
            defaultValue={1}
          />
          <InputNumber
            block
            prefix={yuan}
            suffix={<Button type="primary">结算</Button>}
            min={0}
            defaultValue={128}
          />
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">右侧纵向步进（省宽度）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          <code class="font-mono text-xs">controlsLayout="stack"</code>
          时加号在上、减号在下，两颗按钮只占一列宽度，适合窄位工具栏等场景。
        </p>
        <div class="flex flex-col gap-4 max-w-md">
          <div class="max-w-[7rem]">
            <InputNumber controlsLayout="stack" block min={0} max={99} defaultValue={8} />
          </div>
          <InputNumber controlsLayout="stack" block prefix={yuan} min={0} max={999} defaultValue={99} />
          <InputNumber
            controlsLayout="stack"
            block
            prefix={<span class="text-xs vfui-text-muted">×</span>}
            suffix={<span class="text-xs vfui-text-muted">行</span>}
            min={1}
            max={10}
            defaultValue={3}
          />
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">仅输入（隐藏步进按钮）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          <code class="font-mono text-xs">controls={'{false}'}</code>
          时与单行 Input 外观一致，仍受 min / max / precision 约束。
        </p>
        <InputNumber controls={false} block placeholder="无 +/- 按钮" min={-10} max={10} defaultValue={0} />
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">尺寸、禁用与只读</h3>
        <div class="flex flex-col gap-4 max-w-md">
          <InputNumber size="small" min={0} defaultValue={3} />
          <InputNumber size="middle" min={0} defaultValue={5} />
          <InputNumber size="large" min={0} defaultValue={8} />
          <InputNumber disabled min={0} defaultValue={1} />
          <InputNumber readOnly min={0} defaultValue={7} />
        </div>
      </section>
    </div>
  )
}
