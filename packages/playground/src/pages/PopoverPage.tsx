import { Button, Divider, Popover, Space } from '@viewfly/ui-components'

const basicContent = (
  <div>
    <p class="mb-1">这是一个用于承载更多信息的浮层。</p>
    <p>可放置说明、操作提示或轻量内容。</p>
  </div>
)

export function PopoverPage() {
  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Popover</h2>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">点击触发（默认）</h3>
        <Popover title="关于 Popover" content={basicContent}>
          <Button type="primary">点击打开</Button>
        </Popover>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">悬停触发（hover）</h3>
        <Popover
          trigger="hover"
          placement="right-center"
          title="悬停提示"
          content="移出触发区或面板后会自动收起。"
        >
          <Button type="default">悬停我</Button>
        </Popover>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">不同位置（placement）</h3>
        <Space size={16} wrap>
          <Popover placement="top-start" content="top-start">
            <Button>top-start</Button>
          </Popover>
          <Popover placement="top-center" content="top-center">
            <Button>top-center</Button>
          </Popover>
          <Popover placement="top-end" content="top-end">
            <Button>top-end</Button>
          </Popover>
          <Popover placement="bottom-start" content="bottom-start">
            <Button>bottom-start</Button>
          </Popover>
          <Popover placement="left-center" content="left-center">
            <Button>left-center</Button>
          </Popover>
          <Popover placement="right-center" content="right-center">
            <Button>right-center</Button>
          </Popover>
        </Space>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">纯内容 / 标题 + 内容</h3>
        <Space size={16}>
          <Popover content="仅内容模式，适合简短说明。">
            <Button type="default">仅内容</Button>
          </Popover>
          <Popover
            title="操作确认"
            content={
              <div>
                <p class="mb-2">当前操作不会影响历史数据。</p>
                <Divider spacing="none" />
                <p class="mt-2">建议先在测试环境验证。</p>
              </div>
            }
          >
            <Button type="default">标题 + 内容</Button>
          </Popover>
        </Space>
      </section>
    </div>
  )
}
