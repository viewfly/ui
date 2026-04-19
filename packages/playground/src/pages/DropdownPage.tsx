import type { JSXNode } from '@viewfly/core'
import { createRef } from '@viewfly/core'
import { Button, Dropdown, MenuItem, MenuList } from '@viewfly/ui-components'

const wideMenu = (
  <MenuList role="menu" class="min-w-52">
    <MenuItem>菜单项 A</MenuItem>
    <MenuItem>菜单项 B</MenuItem>
  </MenuList>
)

/** 虚线框作「大触发区」，便于看出与面板的水平/垂直对齐 */
const triggerShell = (inner: JSXNode) => (
  <div class="inline-flex min-h-32 min-w-44 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-800/40 p-2">
    {inner}
  </div>
)

export function DropdownPage() {
  const horizontalTopRef = createRef<HTMLElement>()

  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Dropdown</h2>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">点击触发（默认）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          弹出层通过 <code class="text-xs">Portal</code>（<code class="text-xs">@viewfly/core</code>）挂到{' '}
          <code class="text-xs">document.body</code>
          ，带透明度与位移动画；面板与按钮留有间距。
        </p>
        <Dropdown
          trigger="click"
          dropdown={
            <MenuList role="menu">
              <MenuItem>第一项</MenuItem>
              <MenuItem>第二项</MenuItem>
              <MenuItem>第三项</MenuItem>
            </MenuList>
          }
        >
          <Button type="primary">打开菜单</Button>
        </Dropdown>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">纵向弹出：水平对齐（verticalPanelAlign）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          仅 <code class="text-xs">orientation=&quot;vertical&quot;</code>（默认）时有效：
          <code class="text-xs">left</code> 与触发区左对齐、<code class="text-xs">center</code> 水平居中、
          <code class="text-xs">right</code> 与触发区右对齐；超出视口仍会夹紧。
        </p>
        <div class="flex flex-wrap gap-6 items-start">
          <Dropdown trigger="click" verticalPanelAlign="left" dropdown={wideMenu}>
            {triggerShell(<Button type="primary">left</Button>)}
          </Dropdown>
          <Dropdown trigger="click" verticalPanelAlign="center" dropdown={wideMenu}>
            {triggerShell(<Button type="primary">center</Button>)}
          </Dropdown>
          <Dropdown trigger="click" verticalPanelAlign="right" dropdown={wideMenu}>
            {triggerShell(<Button type="primary">right</Button>)}
          </Dropdown>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">横向：上边缘参考（getHorizontalTopMinFrom）</h3>
        <p class="text-sm vfui-text-muted mb-3">
          下方黄条为参考 DOM；横向弹出时，面板上沿不得低于该条上沿（并与视口 10px 边距取较大值），避免挡住条上方的示意区域。
        </p>
        <div
          ref={horizontalTopRef}
          class="mb-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-xs text-amber-900 dark:text-amber-100"
        >
          参考条（面板上沿 ≥ 本条上沿）
        </div>
        <Dropdown
          orientation="horizontal"
          horizontalAlign="left"
          horizontalPanelAlign="top"
          getHorizontalTopMinFrom={() => horizontalTopRef.current}
          trigger="click"
          dropdown={wideMenu}
        >
          {triggerShell(<Button type="primary">受上沿限制的横向菜单</Button>)}
        </Dropdown>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">横向弹出：垂直对齐（horizontalPanelAlign）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          仅 <code class="text-xs">orientation=&quot;horizontal&quot;</code> 时有效：
          <code class="text-xs">top</code> 顶对齐、<code class="text-xs">middle</code> 垂直居中、
          <code class="text-xs">bottom</code> 底对齐；与 <code class="text-xs">horizontalAlign</code>、视口边距规则共用。
        </p>
        <div class="flex flex-wrap gap-6 items-start">
          <Dropdown
            orientation="horizontal"
            horizontalAlign="left"
            horizontalPanelAlign="top"
            trigger="click"
            dropdown={wideMenu}
          >
            {triggerShell(<Button type="primary">top</Button>)}
          </Dropdown>
          <Dropdown
            orientation="horizontal"
            horizontalAlign="left"
            horizontalPanelAlign="middle"
            trigger="click"
            dropdown={wideMenu}
          >
            {triggerShell(<Button type="primary">middle</Button>)}
          </Dropdown>
          <Dropdown
            orientation="horizontal"
            horizontalAlign="left"
            horizontalPanelAlign="bottom"
            trigger="click"
            dropdown={wideMenu}
          >
            {triggerShell(<Button type="primary">bottom</Button>)}
          </Dropdown>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">横向：优先左 / 右 + 对齐</h3>
        <p class="text-sm vfui-text-muted mb-4">
          <code class="text-xs">horizontalAlign</code> 控制优先在左或右侧；放不下换边。
        </p>
        <div class="flex flex-wrap gap-4 items-start">
          <Dropdown orientation="horizontal" horizontalAlign="left" trigger="click" dropdown={wideMenu}>
            <Button type="primary">优先左侧</Button>
          </Dropdown>
          <Dropdown orientation="horizontal" horizontalAlign="right" trigger="click" dropdown={wideMenu}>
            <Button type="default">优先右侧</Button>
          </Dropdown>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">悬停触发</h3>
        <Dropdown
          trigger="hover"
          dropdown={
            <div class="py-1 px-1">
              <span class="block px-3 py-2 text-sm vfui-text-muted">悬停打开，移入菜单可保持</span>
            </div>
          }
        >
          <Button type="default">悬停我</Button>
        </Dropdown>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">多级嵌套菜单（点击）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          在 <code class="text-xs">MenuList</code> 内再嵌套 <code class="text-xs">Dropdown</code> 即可；子级建议加{' '}
          <code class="text-xs">block</code> 使触发区与常规 <code class="text-xs">MenuItem</code> 一样占满一行。子菜单使用{' '}
          <code class="text-xs">orientation=&quot;horizontal&quot;</code> 与{' '}
          <code class="text-xs">horizontalAlign=&quot;right&quot;</code> 时从菜单项右侧展开。
        </p>
        <Dropdown
          trigger="click"
          dropdown={
            <MenuList role="menu" class="min-w-52">
              <MenuItem>新建文件</MenuItem>
              <MenuItem>保存</MenuItem>
              <Dropdown
                block
                trigger="click"
                orientation="horizontal"
                horizontalAlign="right"
                gap={4}
                dropdown={
                  <MenuList role="menu" class="min-w-44">
                    <MenuItem>复制路径</MenuItem>
                    <MenuItem>在终端打开</MenuItem>
                    <Dropdown
                      block
                      trigger="click"
                      orientation="horizontal"
                      horizontalAlign="right"
                      gap={4}
                      dropdown={
                        <MenuList role="menu" class="min-w-40">
                          <MenuItem>UTF-8</MenuItem>
                          <MenuItem>GBK</MenuItem>
                        </MenuList>
                      }
                    >
                      <button
                        type="button"
                        role="menuitem"
                        class="vfui-menu__item w-full flex items-center justify-between gap-2 text-left"
                      >
                        <span>编码</span>
                        <span class="text-xs opacity-60" aria-hidden="true">
                          ›
                        </span>
                      </button>
                    </Dropdown>
                  </MenuList>
                }
              >
                <button
                  type="button"
                  role="menuitem"
                  class="vfui-menu__item w-full flex items-center justify-between gap-2 text-left"
                >
                  <span>更多</span>
                  <span class="text-xs opacity-60" aria-hidden="true">
                    ›
                  </span>
                </button>
              </Dropdown>
            </MenuList>
          }
        >
          <Button type="primary">文件（多级）</Button>
        </Dropdown>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">多级嵌套（根为悬停 + 子为点击）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          根菜单悬停打开；移入子菜单浮层时会取消根级的关闭计时。子级仍用点击展开，避免纯悬停子菜单在跨 Portal 移动时难以操作。子级 <code class="text-xs">Dropdown</code> 同样使用{' '}
          <code class="text-xs">block</code> 占满一行。
        </p>
        <Dropdown
          trigger="hover"
          dropdown={
            <MenuList role="menu" class="min-w-48">
              <MenuItem>概览</MenuItem>
              <Dropdown
                block
                trigger="click"
                orientation="horizontal"
                horizontalAlign="right"
                gap={4}
                dropdown={
                  <MenuList role="menu" class="min-w-40">
                    <MenuItem>成员</MenuItem>
                    <MenuItem>账单</MenuItem>
                  </MenuList>
                }
              >
                <button
                  type="button"
                  role="menuitem"
                  class="vfui-menu__item w-full flex items-center justify-between gap-2 text-left"
                >
                  <span>设置</span>
                  <span class="text-xs opacity-60" aria-hidden="true">
                    ›
                  </span>
                </button>
              </Dropdown>
            </MenuList>
          }
        >
          <Button type="default">工作区（悬停 + 子菜单）</Button>
        </Dropdown>
      </section>
    </div>
  )
}
