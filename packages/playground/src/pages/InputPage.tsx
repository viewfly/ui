import { createSignal } from '@viewfly/core'
import { Button, Input } from '@viewfly/ui-components'

const searchIcon = (
  <svg class="vfui-input-affix__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M9 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
      stroke="currentColor"
      stroke-width="1.6"
    />
    <path d="m13.2 13.2 3.3 3.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
  </svg>
)

export function InputPage() {
  const draft = createSignal('受控内容')

  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Input</h2>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">非受控</h3>
        <p class="text-sm vfui-text-muted mb-4">初始值「hello」；可直接输入。</p>
        <Input defaultValue="hello" placeholder="请输入" />
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">受控</h3>
        <p class="text-sm vfui-text-muted mb-4">
          当前：<span class="font-mono text-xs">{draft()}</span>
        </p>
        <div class="flex flex-wrap items-center gap-4 max-w-md">
          <Input block value={draft()} onChange={(v) => draft.set(v)} placeholder="块级受控" />
          <button
            type="button"
            class="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/80"
            onClick={() => draft.set('')}
          >
            清空
          </button>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">前缀 / 后缀</h3>
        <p class="text-sm vfui-text-muted mb-4">
          通过 <span class="font-mono text-xs">prefix</span> /{' '}
          <span class="font-mono text-xs">suffix</span> 传入图标或按钮。组合为<strong>分段独立边框</strong>
          （相邻 -1px 重叠，避免双线），任一段聚焦时整组描边同步为主色。
          当某一侧<strong>只有一颗</strong>
          <span class="font-mono text-xs"> Button </span>
          时（任意 type / variant），槽位不设整圈灰框（仅与输入一条接缝），按钮纵向铺满、横向拉满该侧，并保留组件自带描边（多图标 + 按钮等仍保留槽位内边距）。
        </p>
        <div class="flex flex-col gap-4 max-w-md">
          <Input block prefix={searchIcon} placeholder="搜索…" />
          <Input
            block
            prefix={searchIcon}
            placeholder="后缀 primary 按钮贴齐右侧"
            suffix={<Button type="primary">搜索</Button>}
          />
          <Input
            block
            prefix={searchIcon}
            placeholder="后缀 default + outlined"
            suffix={
              <Button type="default" variant="outlined">
                确定
              </Button>
            }
          />
          <Input
            block
            prefix={searchIcon}
            placeholder="后缀 success"
            suffix={<Button type="success">提交</Button>}
          />
          <Input
            block
            size="small"
            prefix={searchIcon}
            placeholder="小号 + small primary"
            suffix={<Button type="primary" size="small">搜索</Button>}
          />
          <Input
            block
            prefix={<Button type="primary">Go</Button>}
            placeholder="前缀 primary 贴齐左侧"
          />
          <Input
            block
            prefix={searchIcon}
            suffix={
              <Button type="default" size="small" variant="text" onClick={() => draft.set('')}>
                清空
              </Button>
            }
            value={draft()}
            onChange={(v) => draft.set(v)}
            placeholder="后缀 text 按钮同样铺满"
          />
          <Input
            block
            prefix={<span class="text-xs font-medium text-gray-600 dark:text-slate-400">https://</span>}
            suffix={<span class="text-xs vfui-text-muted">.com</span>}
            placeholder="example"
          />
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">尺寸、禁用与只读</h3>
        <div class="flex flex-col gap-4 max-w-md">
          <Input size="small" placeholder="小号" />
          <Input size="middle" placeholder="默认中号" />
          <Input size="large" placeholder="大号" />
          <Input disabled placeholder="禁用" defaultValue="不可编辑" />
          <Input readOnly defaultValue="只读" />
        </div>
      </section>
    </div>
  )
}
