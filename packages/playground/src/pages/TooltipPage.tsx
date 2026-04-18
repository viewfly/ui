import { Button, Tooltip, type TooltipPlacement } from '@viewfly/ui-components'

const placements: TooltipPlacement[] = [
  'top-start',
  'top-center',
  'top-end',
  'left-start',
  'left-center',
  'left-end',
  'right-start',
  'right-center',
  'right-end',
  'bottom-start',
  'bottom-center',
  'bottom-end',
]

const cell = 'flex items-center justify-center min-h-[72px] min-w-[100px] p-2'

export function TooltipPage() {
  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Tooltip</h2>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">12 种方位（placement）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          <code class="text-xs">top-*</code> / <code class="text-xs">bottom-*</code> 控制水平对齐（start=左、center=中、end=右）；
          <code class="text-xs">left-*</code> / <code class="text-xs">right-*</code> 控制垂直对齐（start=顶、center=中、end=底）。
          浮层超出视口时会夹紧边距。
        </p>
        <div class="inline-grid grid-cols-3 gap-x-6 gap-y-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50/60 dark:bg-slate-800/40 p-6">
          <div class={cell}>
            <Tooltip placement="top-start" content="top-start">
              <Button type="default" size="small">
                top-start
              </Button>
            </Tooltip>
          </div>
          <div class={cell}>
            <Tooltip placement="top-center" content="top-center">
              <Button type="default" size="small">
                top-center
              </Button>
            </Tooltip>
          </div>
          <div class={cell}>
            <Tooltip placement="top-end" content="top-end">
              <Button type="default" size="small">
                top-end
              </Button>
            </Tooltip>
          </div>

          <div class={cell}>
            <Tooltip placement="left-start" content="left-start">
              <Button type="default" size="small">
                left-start
              </Button>
            </Tooltip>
          </div>
          <div class={`${cell} col-start-2`}>
            <Tooltip placement="top-center" content="中心参考">
              <Button type="primary" size="small">
                中心
              </Button>
            </Tooltip>
          </div>
          <div class={cell}>
            <Tooltip placement="right-start" content="right-start">
              <Button type="default" size="small">
                right-start
              </Button>
            </Tooltip>
          </div>

          <div class={cell}>
            <Tooltip placement="left-center" content="left-center">
              <Button type="default" size="small">
                left-center
              </Button>
            </Tooltip>
          </div>
          <div class={`${cell} col-start-2`} />
          <div class={cell}>
            <Tooltip placement="right-center" content="right-center">
              <Button type="default" size="small">
                right-center
              </Button>
            </Tooltip>
          </div>

          <div class={cell}>
            <Tooltip placement="left-end" content="left-end">
              <Button type="default" size="small">
                left-end
              </Button>
            </Tooltip>
          </div>
          <div class={`${cell} col-start-2`} />
          <div class={cell}>
            <Tooltip placement="right-end" content="right-end">
              <Button type="default" size="small">
                right-end
              </Button>
            </Tooltip>
          </div>

          <div class={cell}>
            <Tooltip placement="bottom-start" content="bottom-start">
              <Button type="default" size="small">
                bottom-start
              </Button>
            </Tooltip>
          </div>
          <div class={cell}>
            <Tooltip placement="bottom-center" content="bottom-center">
              <Button type="default" size="small">
                bottom-center
              </Button>
            </Tooltip>
          </div>
          <div class={cell}>
            <Tooltip placement="bottom-end" content="bottom-end">
              <Button type="default" size="small">
                bottom-end
              </Button>
            </Tooltip>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">列表速览</h3>
        <div class="flex flex-wrap gap-3">
          {placements.map((p) => (
            <Tooltip key={p} placement={p} content={`当前：${p}`}>
              <Button type="default" size="small">
                {p}
              </Button>
            </Tooltip>
          ))}
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">聚焦触发（trigger=&quot;focus&quot;）</h3>
        <p class="text-sm vfui-text-muted mb-3">Tab 聚焦到按钮后显示，移出焦点关闭。</p>
        <Tooltip trigger="focus" placement="bottom-center" content="通过键盘聚焦打开">
          <Button type="primary">Tab 聚焦我</Button>
        </Tooltip>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">自动翻转（flip，默认开启）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          沿首选侧（如 <code class="text-xs">top-*</code>）的剩余空间放不下整块浮层时，会翻到对侧（如{' '}
          <code class="text-xs">bottom-*</code>），<code class="text-xs">start/center/end</code> 不变；仍会在视口内夹紧。
          将下方按钮滚到贴近视口上沿再悬停，便于看到 <code class="text-xs">top-center</code> 翻成{' '}
          <code class="text-xs">bottom-center</code>。
        </p>
        <div class="flex flex-wrap gap-10 items-start">
          <div>
            <p class="text-xs vfui-text-muted mb-2">flip 默认 true</p>
            <Tooltip placement="top-center" content="上方空间不足时会翻到底侧显示">
              <Button type="primary">top-center · 可翻转</Button>
            </Tooltip>
          </div>
          <div>
            <p class="text-xs vfui-text-muted mb-2">flip=&#123;false&#125;</p>
            <Tooltip placement="top-center" flip={false} content="始终按 top 排版，可能被视口夹紧">
              <Button type="default">top-center · 不翻转</Button>
            </Tooltip>
          </div>
        </div>
      </section>
    </div>
  )
}
