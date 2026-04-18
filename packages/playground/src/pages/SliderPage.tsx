import { createSignal } from '@viewfly/core'
import { Slider } from '@viewfly/ui-components'

export function SliderPage() {
  const controlled = createSignal(42)

  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Slider</h2>

      <section class="mb-8 max-w-md">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">默认（非受控）</h3>
        <Slider defaultValue={30} />
      </section>

      <section class="mb-8 max-w-md">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">步长与范围（step=5 · 0–200）</h3>
        <Slider min={0} max={200} step={5} defaultValue={50} />
      </section>

      <section class="mb-8 max-w-md">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">受控</h3>
        <Slider min={0} max={100} value={controlled()} onChange={(v) => controlled.set(v)} />
        <p class="text-sm vfui-text-muted mt-2">当前值：{controlled()}</p>
      </section>

      <section class="mb-8 max-w-md">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">禁用</h3>
        <Slider defaultValue={40} disabled />
      </section>

      <p class="text-xs vfui-text-muted">滑块与轨道可点击；拖动手柄；焦点在手柄上时可用方向键、Home / End、PageUp / PageDown。</p>
    </div>
  )
}
