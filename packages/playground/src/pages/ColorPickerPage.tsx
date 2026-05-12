import { createSignal } from '@viewfly/core'
import { Button, ColorPicker, Dropdown, type Picker } from '@viewfly/ui-components'

export function ColorPickerPage() {
  const liveHex = createSignal<string>('#f00')
  const committedHex = createSignal<string | null>(null)

  const dropdownClickClose = createSignal(0)
  const dropdownHoverClose = createSignal(0)
  const dropdownClickHex = createSignal<string | null>(null)
  const dropdownHoverHex = createSignal<string | null>(null)

  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">ColorPicker</h2>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">基础用法</h3>
        <p class="text-sm vfui-text-muted mb-4 max-w-2xl">
          <code class="text-xs">onChange</code> 在调色过程中持续触发；
          点击色块或点「确定」时触发 <code class="text-xs">onSelected</code>，并会写入「常用颜色」行。
        </p>
        <div class="flex flex-wrap items-start gap-8">
          <ColorPicker
            value="#f00"
            recentColorsName="playground-demo"
            recentColors={['#296eff', '#16a34a', '#d97706']}
            recentColorsLabel="常用颜色"
            paletteTriggerLabel="调色盘"
            confirmLabel="确定"
            onChange={(p: Picker) => {
              if (p.hex) {
                liveHex.set(p.hex)
              }
            }}
            onSelected={(p: Picker) => {
              committedHex.set(p.hex)
            }}
          />
          <div class="text-sm space-y-3 min-w-[12rem]">
            <div>
              <div class="vfui-text-muted text-xs mb-1">过程中（onChange）</div>
              <div class="flex items-center gap-2">
                <span
                  class="inline-block h-8 w-12 rounded border border-gray-200 dark:border-slate-600 shadow-sm"
                  style={{ background: liveHex() }}
                  aria-hidden
                />
                <span class="font-mono text-xs">{liveHex()}</span>
              </div>
            </div>
            <div>
              <div class="vfui-text-muted text-xs mb-1">确定后（onSelected）</div>
              {committedHex() != null
                ? (
                    <div class="flex items-center gap-2">
                      <span
                        class="inline-block h-8 w-12 rounded border border-gray-200 dark:border-slate-600 shadow-sm"
                        style={{ background: committedHex()! }}
                        aria-hidden
                      />
                      <span class="font-mono text-xs">{committedHex()}</span>
                    </div>
                  )
                : (
                    <span class="text-gray-500 dark:text-slate-500 text-xs">尚未点击「确定」</span>
                  )}
            </div>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">配合 Dropdown：点击打开</h3>
        <p class="text-sm vfui-text-muted mb-4 max-w-2xl">
          用 <code class="text-xs">Dropdown</code> 包一层，触发方式为 <code class="text-xs">click</code>；
          在 <code class="text-xs">onSelected</code> 里递增 <code class="text-xs">closeTick</code> 以在「确定」或选预设后收起。
        </p>
        <div class="flex flex-wrap items-center gap-4">
          <Dropdown
            trigger="click"
            closeTick={dropdownClickClose}
            verticalPanelAlign="left"
            gap={8}
            dropdown={(
              <div
                onMousedown={(e: MouseEvent) => e.stopPropagation()}
                class="p-0 m-0"
              >
                <ColorPicker
                  value="#296eff"
                  recentColorsName="playground-dropdown-click"
                  recentColorsLabel="常用颜色"
                  paletteTriggerLabel="调色盘"
                  confirmLabel="确定"
                  onSelected={(p: Picker) => {
                    dropdownClickHex.set(p.hex)
                    dropdownClickClose.set(dropdownClickClose() + 1)
                  }}
                />
              </div>
            )}
          >
            <Button type="primary">点击选色</Button>
          </Dropdown>
          <span class="text-sm vfui-text-muted">
            已选：
            <span class="font-mono text-xs text-gray-900 dark:text-slate-100">
              {dropdownClickHex() ?? '—'}
            </span>
          </span>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">配合 Dropdown：悬停打开</h3>
        <p class="text-sm vfui-text-muted mb-4 max-w-2xl">
          <code class="text-xs">trigger=&#34;hover&#34;</code> 时移入按钮展开，移开按钮与面板会延时收起（与
          <code class="text-xs"> Dropdown </code> 行为一致）。同样可在 <code class="text-xs">onSelected</code> 里关闭。
        </p>
        <div class="flex flex-wrap items-center gap-4">
          <Dropdown
            trigger="hover"
            closeTick={dropdownHoverClose}
            verticalPanelAlign="left"
            gap={8}
            dropdown={(
              <div
                onMousedown={(e: MouseEvent) => e.stopPropagation()}
                class="p-0 m-0"
              >
                <ColorPicker
                  value="#16a34a"
                  recentColorsName="playground-dropdown-hover"
                  recentColorsLabel="常用颜色"
                  paletteTriggerLabel="调色盘"
                  confirmLabel="确定"
                  onSelected={(p: Picker) => {
                    dropdownHoverHex.set(p.hex)
                    dropdownHoverClose.set(dropdownHoverClose() + 1)
                  }}
                />
              </div>
            )}
          >
            <Button type="default">悬停选色</Button>
          </Dropdown>
          <span class="text-sm vfui-text-muted">
            已选：
            <span class="font-mono text-xs text-gray-900 dark:text-slate-100">
              {dropdownHoverHex() ?? '—'}
            </span>
          </span>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-medium vfui-text-muted mb-3">说明</h3>
        <p class="text-sm vfui-text-muted max-w-2xl space-y-2">
          <span class="block">
            可通过 <code class="text-xs">value</code> 设初始色；<code class="text-xs">recentColors</code> 为「常用颜色」的初始回退（无本地缓存时生效）。
          </span>
          <span class="block">
            本页示例已设置 <code class="text-xs">recentColorsName="playground-demo"</code>，常用色会按名称写入
            <code class="text-xs">localStorage</code>，刷新后仍保留；不同业务场景用不同 <code class="text-xs">recentColorsName</code> 即可隔离。
          </span>
        </p>
      </section>
    </div>
  )
}
