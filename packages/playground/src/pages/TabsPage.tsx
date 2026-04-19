import { createSignal } from '@viewfly/core'
import { Tab, TabList, TabPanel, Tabs } from '@viewfly/ui-components'

export function TabsPage() {
  const controlled = createSignal('b')

  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Tabs</h2>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">非受控（defaultValue）</h3>
        <Tabs defaultValue="write">
          <TabList>
            <Tab value="read">阅读</Tab>
            <Tab value="write">写作</Tab>
            <Tab value="settings" disabled>
              设置（禁用）
            </Tab>
          </TabList>
          <TabPanel value="read">
            <p class="vfui-text-muted">当前为「阅读」面板；可用左右方向键切换标签。</p>
          </TabPanel>
          <TabPanel value="write">
            <p class="vfui-text-muted">当前为「写作」面板。</p>
          </TabPanel>
          <TabPanel value="settings">不会显示（对应 Tab 已禁用）。</TabPanel>
        </Tabs>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">受控（value + onChange）</h3>
        <Tabs value={controlled()} onChange={(v) => controlled.set(v)}>
          <TabList>
            <Tab value="a">面板 A</Tab>
            <Tab value="b">面板 B</Tab>
            <Tab value="c">面板 C</Tab>
          </TabList>
          <TabPanel value="a">内容 A，当前选中：{controlled()}</TabPanel>
          <TabPanel value="b">内容 B，当前选中：{controlled()}</TabPanel>
          <TabPanel value="c">内容 C，当前选中：{controlled()}</TabPanel>
        </Tabs>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">纵向（orientation=&quot;vertical&quot;）</h3>
        <Tabs defaultValue="one" orientation="vertical" class="max-w-xl">
          <TabList>
            <Tab value="one">第一项</Tab>
            <Tab value="two">第二项</Tab>
          </TabList>
          <TabPanel value="one">纵向布局下标签在左，内容在右；可用上下方向键切换。</TabPanel>
          <TabPanel value="two">第二段内容。</TabPanel>
        </Tabs>
      </section>
    </div>
  )
}
