import { Button, Divider, Dropdown, MenuItem, MenuList, Popover, Space } from '@viewfly/ui-components'
import { createSignal, reactive } from '@viewfly/core'

const basicContent = (
  <div>
    <p class="mb-1">这是一个用于承载更多信息的浮层。</p>
    <p>可放置说明、操作提示或轻量内容。</p>
  </div>
)

const popoverDropdownMenu = (
  <MenuList role="menu" class="min-w-40">
    <MenuItem onClick={() => console.log('popover-dropdown', 'edit')}>编辑</MenuItem>
    <MenuItem onClick={() => console.log('popover-dropdown', 'copy')}>复制链接</MenuItem>
    <MenuItem onClick={() => console.log('popover-dropdown', 'archive')}>归档</MenuItem>
  </MenuList>
)

export function PopoverPage() {
  const externalOpen = createSignal(false)
  const externalRefBox = reactive({
    left: 520,
    top: 220,
    width: 1,
    height: 1,
  })
  const externalComboOpen = createSignal(false)
  const externalComboRefBox = reactive({
    left: 520,
    top: 300,
    width: 1,
    height: 1,
  })

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
        <h3 class="text-sm font-medium vfui-text-muted mb-3">无箭头 / 无边框</h3>
        <p class="text-sm vfui-text-muted mb-4">
          <code class="text-xs">{'showArrow={false}'}</code> 隐藏小三角；<code class="text-xs">{'bordered={false}'}</code>{' '}
          去掉面板描边（仍保留阴影与圆角）。
        </p>
        <Space size={16}>
          <Popover showArrow={false} title="无箭头" content={basicContent}>
            <Button type="default">无箭头</Button>
          </Popover>
          <Popover bordered={false} title="无边框" content={basicContent}>
            <Button type="default">无边框</Button>
          </Popover>
          <Popover showArrow={false} bordered={false} content="无箭头且无边框，适合贴卡片或极简浮层。">
            <Button type="default">两者皆无</Button>
          </Popover>
        </Space>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">组合场景：Popover 内嵌 Dropdown</h3>
        <p class="text-sm vfui-text-muted mb-4">
          点击 Dropdown 菜单时，Popover 不会误关闭。下面同时演示「点击触发 Popover」与「外部受控 Popover」两种场景。
        </p>
        <Space size={16} wrap>
          <Popover
            title="点击触发 + Dropdown"
            content={
              <div class="flex items-center gap-2">
                <span class="text-sm">更多操作：</span>
                <Dropdown trigger="click" dropdown={popoverDropdownMenu}>
                  <Button type="default" size="small">
                    打开菜单
                  </Button>
                </Dropdown>
              </div>
            }
          >
            <Button type="default">点击触发组合</Button>
          </Popover>
          <Button type="primary" onClick={() => externalComboOpen.set(true)}>
            打开外部受控组合
          </Button>
          <Button type="default" onClick={() => externalComboOpen.set(false)}>
            关闭外部受控组合
          </Button>
        </Space>
        <Popover
          open={externalComboOpen()}
          referenceBox={externalComboRefBox}
          placement="bottom-start"
          title="外部受控 + Dropdown"
          content={
            <div class="flex items-center gap-2">
              <span class="text-sm">菜单交互：</span>
              <Dropdown trigger="click" dropdown={popoverDropdownMenu}>
                <Button type="default" size="small">
                  受控内菜单
                </Button>
              </Dropdown>
            </div>
          }
        />
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">外部受控（open + referenceBox）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          该示例不通过 Popover 内部触发区控制显隐，而是由外部传入 <code class="text-xs">open</code> 与{' '}
          <code class="text-xs">referenceBox</code> 完全控制。
        </p>
        <Space size={12} wrap>
          <Button type="primary" onClick={() => externalOpen.set(true)}>
            外部打开
          </Button>
          <Button type="default" onClick={() => externalOpen.set(false)}>
            外部关闭
          </Button>
          <Button
            type="default"
            onClick={() => {
              externalRefBox.left -= 30
            }}
          >
            左移锚点
          </Button>
          <Button
            type="default"
            onClick={() => {
              externalRefBox.left += 30
            }}
          >
            右移锚点
          </Button>
          <Button
            type="default"
            onClick={() => {
              externalRefBox.top -= 20
            }}
          >
            上移锚点
          </Button>
          <Button
            type="default"
            onClick={() => {
              externalRefBox.top += 20
            }}
          >
            下移锚点
          </Button>
        </Space>
        <Popover
          open={externalOpen()}
          referenceBox={externalRefBox}
          placement="bottom-center"
          content={
            <div>
              <p class="mb-1">这是一个外部受控 Popover。</p>
              <p class="text-xs vfui-text-muted">
                参考盒子：left={externalRefBox.left}，top={externalRefBox.top}
              </p>
            </div>
          }
        />
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
