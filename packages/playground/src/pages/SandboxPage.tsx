import { Button, Dropdown, MenuItem, MenuList } from '@viewfly/ui-components'

/**
 * 通用试验页：临时堆示例、调交互、复现问题，不必对应某个正式组件文档。
 */
export function SandboxPage() {
  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">沙盒</h2>
      <p class="text-sm vfui-text-muted mb-6">随意放各组件的草稿示例与联调，不保证长期维护。</p>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">Dropdown</h3>
        <p class="text-sm vfui-text-muted mb-4">点击按钮展开菜单，可在此增删改以验证行为。</p>
        <Dropdown
          trigger="click"
          dropdown={(
            <MenuList role="menu">
              <MenuItem>选项一</MenuItem>
              <MenuItem>选项二</MenuItem>
              <MenuItem>选项三</MenuItem>
            </MenuList>
          )}
        >
          <Button type="primary">打开下拉</Button>
        </Dropdown>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">Dropdown：根内并列两个子下拉（全悬停）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          根与两个子级均为 <code class="text-xs">trigger=&quot;hover&quot;</code>；子级使用{' '}
          <code class="text-xs">block</code>、<code class="text-xs">orientation=&quot;horizontal&quot;</code> 与{' '}
          <code class="text-xs">horizontalAlign=&quot;right&quot;</code>，从菜单项右侧展开。
        </p>
        <Dropdown
          trigger="hover"
          dropdown={
            <MenuList role="menu" class="min-w-52">
              <MenuItem>仅一级项</MenuItem>
              <Dropdown
                block
                trigger="hover"
                orientation="horizontal"
                horizontalAlign="right"
                dropdown={
                  <MenuList role="menu" class="min-w-40">
                    <MenuItem>导出 PDF</MenuItem>
                    <MenuItem>导出 Markdown</MenuItem>
                  </MenuList>
                }
              >
                <MenuItem chevronRight>导出</MenuItem>
              </Dropdown>
              <Dropdown
                block
                trigger="hover"
                orientation="horizontal"
                horizontalAlign="right"
                dropdown={
                  <MenuList role="menu" class="min-w-40">
                    <MenuItem>浅色主题</MenuItem>
                    <MenuItem>深色主题</MenuItem>
                  </MenuList>
                }
              >
                <MenuItem chevronRight>主题</MenuItem>
              </Dropdown>
            </MenuList>
          }
        >
          <Button type="default">文件与外观（悬停 · 两个子下拉）</Button>
        </Dropdown>
      </section>
    </div>
  )
}
