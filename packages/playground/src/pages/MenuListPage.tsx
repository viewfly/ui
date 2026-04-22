import { createSignal } from '@viewfly/core'
import { Divider, MenuItem, MenuList } from '@viewfly/ui-components'
import { IconGlyph } from '@viewfly/ui-icons'

export function MenuListPage() {
  const listboxValue = createSignal('a')

  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">MenuList</h2>
      <p class="text-sm text-gray-600 dark:text-slate-400 mb-6 max-w-2xl">
        <code class="text-xs">MenuList</code> 与 <code class="text-xs">MenuItem</code> 用于下拉、气泡等中的选项列表。在业务项目中需同步引入
        样式包{' '}
        <code class="text-xs">@viewfly/ui-components/style.css</code>
        （或确保入口已导入组件库打出来的全局 CSS），否则只有 DOM 与语义、没有视觉样式。
      </p>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">基础（role=&quot;menu&quot;）</h3>
        <div class="rounded-md border border-gray-200 dark:border-slate-700 p-3 max-w-sm vfui-surface-elevated">
          <MenuList role="menu" class="min-w-48">
            <MenuItem>概览</MenuItem>
            <MenuItem>成员与权限</MenuItem>
            <MenuItem>账单</MenuItem>
          </MenuList>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">style</h3>
        <p class="text-sm vfui-text-muted mb-4">
          用 <code class="text-xs">style=&#123;&#123; ... &#125;&#125;</code> 或行内 CSS 字符串定制根节点（含 <code class="text-xs">width</code> / <code class="text-xs">minWidth</code> 等）。
        </p>
        <div class="flex flex-col gap-4 max-w-md">
          <div class="rounded-md border border-gray-200 dark:border-slate-700 p-3">
            <p class="text-xs vfui-text-muted mb-2">style=&#123;&#123; width: &apos;220px&apos; &#125;&#125;</p>
            <MenuList role="menu" style={{ width: '220px' }}>
              <MenuItem>固定 220px</MenuItem>
              <MenuItem>第二项</MenuItem>
            </MenuList>
          </div>
          <div class="rounded-md border border-gray-200 dark:border-slate-700 p-3">
            <p class="text-xs vfui-text-muted mb-2">style=&#123;&#123; minWidth: &apos;12rem&apos;, maxWidth: &apos;100%&apos; &#125;&#125;</p>
            <MenuList
              role="menu"
              style={{ minWidth: '12rem', maxWidth: '100%', boxSizing: 'border-box' }}
            >
              <MenuItem>min 12rem</MenuItem>
              <MenuItem>随父级不超出</MenuItem>
            </MenuList>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">左侧 icon</h3>
        <p class="text-sm vfui-text-muted mb-4">
          通过 <code class="text-xs">icon</code> 插入左侧图标槽（固定列宽，便于多行文案对齐）；可与 <code class="text-xs">chevronRight</code> 同用。
        </p>
        <div class="rounded-md border border-gray-200 dark:border-slate-700 p-3 max-w-sm">
          <MenuList role="menu" class="min-w-56">
            <MenuItem icon={<IconGlyph name="plus" class="text-gray-500 dark:text-slate-400" size={16} />}>新建</MenuItem>
            <MenuItem icon={<IconGlyph name="image" class="text-gray-500 dark:text-slate-400" size={16} />}>
              打开
            </MenuItem>
            <MenuItem
              selected
              icon={<IconGlyph name="checkmark" class="text-primary-500 dark:text-primary-400" size={16} />}
            >
              当前选中
            </MenuItem>
            <MenuItem
              chevronRight
              icon={<IconGlyph name="more" class="text-gray-500 dark:text-slate-400" size={16} />}
            >
              更多设置
            </MenuItem>
          </MenuList>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">列紧凑（columnCompact + density）</h3>
        <p class="text-sm vfui-text-muted mb-4">与 <code class="text-xs">Dropdown</code> 的 <code class="text-xs">menuColumnCompact</code> 作用一致，也可单独用在静态菜单上。</p>
        <div class="rounded-md border border-gray-200 dark:border-slate-700 p-3 max-w-sm">
          <MenuList role="menu" columnCompact class="min-w-48">
            <MenuItem density="compact">项 A</MenuItem>
            <MenuItem density="compact">项 B</MenuItem>
            <MenuItem density="compact">项 C</MenuItem>
          </MenuList>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">选中、禁用、右侧箭头</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-md border border-gray-200 dark:border-slate-700 p-3">
            <p class="text-xs vfui-text-muted mb-2">selected</p>
            <MenuList role="menu" class="min-w-48">
              <MenuItem>未选</MenuItem>
              <MenuItem selected>当前选中</MenuItem>
              <MenuItem>另一项</MenuItem>
            </MenuList>
          </div>
          <div class="rounded-md border border-gray-200 dark:border-slate-700 p-3">
            <p class="text-xs vfui-text-muted mb-2">disabled / chevronRight</p>
            <MenuList role="menu" class="min-w-48">
              <MenuItem>可用</MenuItem>
              <MenuItem disabled>禁用</MenuItem>
              <MenuItem chevronRight>子菜单</MenuItem>
            </MenuList>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">listbox 语义（与 Select 一致）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          <code class="text-xs">role=&quot;listbox&quot;</code> 时 <code class="text-xs">MenuItem</code> 使用 <code class="text-xs">role=&quot;option&quot;</code> 与 <code class="text-xs">aria-selected</code>。
        </p>
        <div class="rounded-md border border-gray-200 dark:border-slate-700 p-3 max-w-sm">
          <MenuList role="listbox" class="min-w-48" id="demo-listbox">
            {(['a', 'b', 'c'] as const).map((v) => (
              <MenuItem
                key={v}
                role="option"
                selected={listboxValue() === v}
                onClick={() => listboxValue.set(v)}
              >
                选项 {v.toUpperCase()}
              </MenuItem>
            ))}
          </MenuList>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">分组与滚动</h3>
        <p class="text-sm vfui-text-muted mb-4">
          穿插 <code class="text-xs">Divider</code> 分组。列表本身不限制高度；在 <code class="text-xs">Dropdown</code> 内时由弹出层面板限制为最高 400px 并滚动。下方示例在静态容器上用了{' '}
          <code class="text-xs">max-h-36</code> 模拟长列表。
        </p>
        <div class="rounded-md border border-gray-200 dark:border-slate-700 p-3 max-w-sm">
          <MenuList role="menu" class="min-w-52 max-h-36 overflow-y-auto">
            <MenuItem>第一项</MenuItem>
            <MenuItem>第二项</MenuItem>
            <Divider spacing="none" />
            <MenuItem>第三项</MenuItem>
            <MenuItem>第四项</MenuItem>
            <MenuItem>第五项</MenuItem>
            <MenuItem>第六项</MenuItem>
          </MenuList>
        </div>
      </section>
    </div>
  )
}
