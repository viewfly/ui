import { Fragment } from '@viewfly/core'
import { Button } from '@viewfly/ui-components'
import { IconCheck } from '@viewfly/ui-icons'

export function ButtonPage() {
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
