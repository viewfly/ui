import { Fragment, createSignal } from '@viewfly/core'
import { Button, Dropdown, MenuItem, MenuList } from '@viewfly/ui-components'
import { IconCheck } from '@viewfly/ui-icons'

export function ButtonPage() {
  const toggleHighlight = createSignal(true)

  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Button</h2>

      <section class="mb-8">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">按钮语义</h3>
        <div class="flex flex-wrap gap-2 items-center">
          <Button type="default">默认</Button>
          <Button type="primary">
            <Fragment>
              <IconCheck size={14} class="inline-block align-text-bottom mr-1" />
              主要
            </Fragment>
          </Button>
          <Button type="success">成功</Button>
          <Button type="warning">警告</Button>
          <Button type="danger">危险</Button>
          <Button type="info">信息</Button>
        </div>
      </section>

      <section class="mb-8">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">按钮变体（variant）</h3>
        <div class="flex flex-wrap gap-2 items-center">
          <Button type="primary" variant="solid">
            solid
          </Button>
          <Button type="primary" variant="outlined">
            outlined
          </Button>
          <Button type="primary" variant="dashed">
            dashed
          </Button>
          <Button type="primary" variant="filled">
            filled
          </Button>
          <Button type="primary" variant="text">
            text
          </Button>
          <Button type="primary" variant="link">
            link（button）
          </Button>
          <Button variant="link" href="https://example.com" target="_blank">
            link（a · 新标签打开，自动 rel）
          </Button>
          <Button type="primary" variant="link" href="https://example.com">
            link（a · primary 色）
          </Button>
        </div>
      </section>

      <section class="mb-8">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">高亮（highlighted）</h3>
        <p class="text-sm vfui-text-muted mb-3">
          仅 <span class="font-mono text-xs">variant=&quot;text&quot;</span> 且默认语义色（<span class="font-mono text-xs">type</span> 为 default
          或未指定）时生效，文案变为主色；其它变体传入会被忽略。禁用时、<span class="font-mono text-xs">loading</span> 时不会加高亮类。
        </p>
        <div class="flex flex-wrap gap-2 items-center mb-3">
          <Button variant="text" highlighted>
            已筛选
          </Button>
          <Button variant="text">未高亮</Button>
        </div>
        <div class="flex flex-wrap gap-2 items-center">
          <Button
            variant="text"
            highlighted={toggleHighlight()}
            aria-pressed={toggleHighlight() ? true : undefined}
            onClick={() => toggleHighlight.set(!toggleHighlight())}
          >
            点击切换（模拟条件为真）
          </Button>
        </div>
        <div class="mt-4 rounded-lg border border-dashed border-gray-300 dark:border-slate-600 p-3">
          <div class="text-xs vfui-text-muted mb-2">对比：default + text（正常）vs disabled（深色主题下重点看文字明度差）</div>
          <div class="flex flex-wrap gap-2 items-center">
            <Button variant="text">default + text</Button>
            <Button variant="text" disabled>
              default + text disabled
            </Button>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">尺寸与形状</h3>
        <div class="flex flex-wrap gap-2 items-center mb-3">
          <Button type="primary" size="small">
            small
          </Button>
          <Button type="primary" size="middle">
            middle
          </Button>
          <Button type="primary" size="large">
            large
          </Button>
        </div>
        <div class="flex flex-wrap gap-2 items-center mb-3">
          <Button type="primary" shape="round">
            round
          </Button>
          <Button type="primary" shape="circle" size="small" aria-label="确认">
            <IconCheck size={14} />
          </Button>
          <Button type="primary" shape="circle" aria-label="确认">
            <IconCheck size={16} />
          </Button>
          <Button type="primary" shape="circle" size="large" aria-label="确认">
            <IconCheck size={18} />
          </Button>
        </div>
        <form
          class="flex flex-wrap gap-2 items-center"
          onSubmit={(e) => {
            e.preventDefault()
            window.alert('submit（已 preventDefault）')
          }}
        >
          <input class="border rounded px-2 py-1 text-sm w-40 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800" placeholder="示例输入" />
          <Button type="primary" htmlType="submit">
            htmlType=submit
          </Button>
          <Button type="default" htmlType="reset">
            htmlType=reset
          </Button>
        </form>
        <p class="text-sm vfui-text-muted mt-4 mb-2">
          <code class="text-xs">inlineCompact</code>：在保持 <code class="text-xs">size</code> 垂直高度不变的前提下缩小左右内边距，适合分段控件、下拉内按钮等。
        </p>
        <div class="flex flex-wrap gap-2 items-center">
          <Button type="primary">默认 padding</Button>
          <Button type="primary" inlineCompact>
            inlineCompact
          </Button>
          <Button type="primary" size="small" inlineCompact>
            small + inlineCompact
          </Button>
          <Button type="default" variant="outlined" inlineCompact icon={<IconCheck size={14} />}>
            紧凑 + 图标
          </Button>
        </div>
      </section>

      <section class="mb-8">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">loading · icon · block</h3>
        <div class="flex flex-wrap gap-2 items-center mb-3">
          <Button type="primary" loading>
            加载中
          </Button>
          <Button type="primary" variant="outlined" loading>
            请求中
          </Button>
          <Button type="primary" shape="circle" loading aria-label="加载中" />
        </div>
        <div class="flex flex-wrap gap-2 items-center mb-3">
          <Button type="primary" icon={<IconCheck size={14} />}>
            左侧图标
          </Button>
          <Button type="primary" icon={<IconCheck size={14} />} iconPosition="end">
            右侧图标
          </Button>
        </div>
        <div class="mb-2 text-sm vfui-text-muted">下拉触发：默认文案与箭头有间距；`chevronGapless` 为真时无间距</div>
        <div class="flex flex-wrap gap-4 items-center mb-3">
          <Dropdown
            trigger="click"
            dropdown={
              <MenuList role="menu">
                <MenuItem>项 A</MenuItem>
                <MenuItem>项 B</MenuItem>
              </MenuList>
            }
          >
            <Button type="primary">默认间距</Button>
          </Dropdown>
          <Dropdown
            trigger="click"
            dropdown={
              <MenuList role="menu">
                <MenuItem>项 A</MenuItem>
                <MenuItem>项 B</MenuItem>
              </MenuList>
            }
          >
            <Button type="primary" chevronGapless>
              无间距
            </Button>
          </Dropdown>
        </div>
        <div class="max-w-xs flex flex-col gap-2">
          <Button type="primary" block>
            块级按钮
          </Button>
          <Button type="default" block variant="outlined" icon={<IconCheck size={14} />}>
            块级 + 图标
          </Button>
        </div>
      </section>

      <section class="mb-8">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">禁用（disabled）</h3>
        <div class="flex flex-wrap gap-2 items-center mb-3">
          <Button type="default" disabled>
            默认
          </Button>
          <Button type="primary" disabled>
            主要
          </Button>
          <Button type="success" disabled>
            成功
          </Button>
          <Button type="warning" disabled>
            警告
          </Button>
          <Button type="danger" disabled>
            危险
          </Button>
          <Button type="info" disabled>
            信息
          </Button>
        </div>
        <div class="flex flex-wrap gap-2 items-center mb-3">
          <Button type="primary" variant="outlined" disabled>
            outlined
          </Button>
          <Button type="primary" variant="filled" disabled>
            filled
          </Button>
          <Button type="primary" variant="text" disabled>
            text
          </Button>
          <Button type="primary" variant="link" disabled>
            link
          </Button>
          <Button type="primary" disabled icon={<IconCheck size={14} />}>
            带图标
          </Button>
        </div>
        <div class="flex flex-wrap gap-2 items-center">
          <Button type="primary" disabled loading>
            loading + disabled
          </Button>
        </div>
      </section>

      <section class="mb-8">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">Design tokens（弱背景 + 边框）</h3>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div class="rounded-lg border px-3 py-2 border-[var(--vfui-tone-primary-border)] bg-[var(--vfui-tone-primary-bg)] text-[var(--vfui-tone-primary-fg)]">
            primary tone
          </div>
          <div class="rounded-lg border px-3 py-2 border-[var(--vfui-tone-success-border)] bg-[var(--vfui-tone-success-bg)] text-[var(--vfui-tone-success-fg)]">
            success tone
          </div>
          <div class="rounded-lg border px-3 py-2 border-[var(--vfui-tone-warning-border)] bg-[var(--vfui-tone-warning-bg)] text-[var(--vfui-tone-warning-fg)]">
            warning tone
          </div>
          <div class="rounded-lg border px-3 py-2 border-[var(--vfui-tone-danger-border)] bg-[var(--vfui-tone-danger-bg)] text-[var(--vfui-tone-danger-fg)]">
            danger tone
          </div>
          <div class="rounded-lg border px-3 py-2 border-[var(--vfui-tone-info-border)] bg-[var(--vfui-tone-info-bg)] text-[var(--vfui-tone-info-fg)]">
            info tone
          </div>
        </div>
      </section>

      <p class="text-xs vfui-text-muted">
        Uno 语义色阶示例：
        <span class="text-success-600 dark:text-success-400"> success </span>
        <span class="text-danger-600 dark:text-danger-400"> danger </span>
        <span class="text-info-600 dark:text-info-400"> info </span>
      </p>
    </div>
  )
}
