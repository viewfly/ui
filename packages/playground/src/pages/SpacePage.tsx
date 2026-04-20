import { Button, Divider, Dropdown, MenuItem, MenuList, Space } from '@viewfly/ui-components'
import { IconGlyph } from '@viewfly/ui-icons'

export function SpacePage() {
  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Space</h2>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">横向 · 间距档位</h3>
        <p class="text-sm vfui-text-muted mb-4">
          <code class="text-xs">size</code>：<code class="text-xs">small</code>（8px）、<code class="text-xs">middle</code>（16px）、
          <code class="text-xs">large</code>（24px），或传入数字（px）与 Ant Design 习惯接近。
        </p>
        <div class="flex flex-col gap-6">
          <Space size="small">
            <Button type="default">small</Button>
            <Button type="default">8px</Button>
          </Space>
          <Space size="middle">
            <Button type="primary">middle</Button>
            <Button type="primary">16px</Button>
          </Space>
          <Space size="large">
            <Button type="default">large</Button>
            <Button type="default">24px</Button>
          </Space>
          <Space size={20}>
            <Button type="default">数字</Button>
            <Button type="default">20px</Button>
          </Space>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">纵向 · 对齐</h3>
        <p class="text-sm vfui-text-muted mb-4">
          <code class="text-xs">direction=&quot;vertical&quot;</code>；<code class="text-xs">align</code> 控制交叉轴（此处为水平方向）。
        </p>
        <Space direction="vertical" size="middle" align="start">
          <Button type="default">顶对齐</Button>
          <span class="text-sm vfui-text-muted">说明文案</span>
          <Button type="primary">主按钮</Button>
        </Space>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">换行 · 元组间距</h3>
        <p class="text-sm vfui-text-muted mb-4">
          <code class="text-xs">wrap</code> 为真时横向可折行；<code class="text-xs">{`size={[列间距, 行间距]}`}</code>{' '}
          以像素控制列/行 gap。
        </p>
        <div class="max-w-xs rounded-lg border border-dashed border-gray-300 dark:border-slate-600 p-3">
          <Space wrap size={[12, 16]}>
            <Button type="default">一</Button>
            <Button type="default">二</Button>
            <Button type="default">三</Button>
            <Button type="default">四</Button>
            <Button type="default">五</Button>
          </Space>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">分隔符（split）</h3>
        <Space split={<Divider direction="vertical" />}>
          <Button type="default" variant="link">
            链接
          </Button>
          <Button type="default" variant="link">
            另一项
          </Button>
          <Button type="default" variant="link">
            更多
          </Button>
        </Space>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">Space.Compact（与 Dropdown 组合）</h3>
        <Space.Compact>
          <Button type="default">操作</Button>
          <Dropdown
            trigger="click"
            verticalPanelAlign="right"
            dropdown={
              <MenuList role="menu">
                <MenuItem>选项 A</MenuItem>
                <MenuItem>选项 B</MenuItem>
              </MenuList>
            }
          >
            <Button type="default" chevronDown={false} class="px-2.5" icon={<IconGlyph name="more" size={16} />} />
          </Dropdown>
        </Space.Compact>
      </section>
    </div>
  )
}
