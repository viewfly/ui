import type { JSXNode } from '@viewfly/core'
import { createRef, createSignal } from '@viewfly/core'
import { Button, ColorPicker, Divider, Dropdown, MenuItem, MenuList, Space, type Picker } from '@viewfly/ui-components'
import { IconGlyph } from '@viewfly/ui-icons'

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
  const horizontalTopRef = createRef<HTMLDivElement>()
  const dropdownClickClose = createSignal(0)
  const dropdownHoverClose = createSignal(0)
  const controlledOpen = createSignal(false)
  const dropdownClickHex = createSignal<string | null>(null)
  const dropdownHoverHex = createSignal<string | null>(null)

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
        <h3 class="text-sm font-medium vfui-text-muted mb-3">受控模式：通过 open 外部控制</h3>
        <p class="text-sm vfui-text-muted mb-4">
          传入 <code class="text-xs">open</code> 后由外部状态决定显示；在{' '}
          <code class="text-xs">onOpenChange</code> 中回写，保留点击触发与外部按钮的双向同步。
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <Dropdown
            trigger="click"
            open={controlledOpen()}
            onOpenChange={(v) => controlledOpen.set(v)}
            dropdown={(
              <MenuList role="menu" class="min-w-40">
                <MenuItem onClick={() => controlledOpen.set(false)}>关闭面板</MenuItem>
                <MenuItem>受控项 A</MenuItem>
                <MenuItem>受控项 B</MenuItem>
              </MenuList>
            )}
          >
            <Button type="primary">受控 Dropdown</Button>
          </Dropdown>
          <Button type="default" onClick={() => controlledOpen.set(!controlledOpen())}>
            外部切换
          </Button>
          <Button type="default" onClick={() => controlledOpen.set(false)}>
            外部关闭
          </Button>
          <span class="text-sm vfui-text-muted">
            当前状态：
            <span class="font-mono text-xs text-gray-900 dark:text-slate-100">{controlledOpen() ? 'open' : 'closed'}</span>
          </span>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">下拉弹出颜色选择器（双悬停）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          两个示例都用 <code class="text-xs">trigger=&quot;hover&quot;</code>；在 <code class="text-xs">onSelected</code> 里递增 <code class="text-xs">closeTick</code>，选色后自动收起。
        </p>
        <div class="flex flex-wrap items-start gap-3">
          <div class="flex items-center gap-3">
            <Dropdown
              trigger="hover"
              closeTick={dropdownClickClose}
              verticalPanelAlign="left"
              gap={8}
              dropdown={(
                <div onMousedown={(e: MouseEvent) => e.stopPropagation()}>
                  <ColorPicker
                    value="#296eff"
                    recentColorsName="playground-dropdown-click"
                    onSelected={(p: Picker) => {
                      dropdownClickHex.set(p.hex)
                      dropdownClickClose.set(dropdownClickClose() + 1)
                    }}
                  />
                </div>
              )}
            >
              <Button type="primary">悬停选色 A</Button>
            </Dropdown>
            <span class="text-sm vfui-text-muted">
              已选：
              <span class="font-mono text-xs text-gray-900 dark:text-slate-100">{dropdownClickHex() ?? '—'}</span>
            </span>
          </div>

          <div class="flex items-center gap-3">
            <Dropdown
              trigger="hover"
              closeTick={dropdownHoverClose}
              verticalPanelAlign="left"
              gap={8}
              dropdown={(
                <div onMousedown={(e: MouseEvent) => e.stopPropagation()}>
                  <ColorPicker
                    value="#16a34a"
                    recentColorsName="playground-dropdown-hover"
                    onSelected={(p: Picker) => {
                      dropdownHoverHex.set(p.hex)
                      dropdownHoverClose.set(dropdownHoverClose() + 1)
                    }}
                  />
                </div>
              )}
            >
              <Button type="default">悬停选色 B</Button>
            </Dropdown>
            <span class="text-sm vfui-text-muted">
              已选：
              <span class="font-mono text-xs text-gray-900 dark:text-slate-100">{dropdownHoverHex() ?? '—'}</span>
            </span>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">紧凑组合：主按钮 + 下拉（Space.Compact）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          用 <code class="text-xs">Space.Compact</code> 包裹相邻控件（亦导出同名 <code class="text-xs">SpaceCompact</code>
          ）：共享竖向边框与分段圆角。主按钮可单独{' '}
          <code class="text-xs">onClick</code>；右侧图标按钮置于 <code class="text-xs">Dropdown</code> 内，菜单用{' '}
          <code class="text-xs">verticalPanelAlign=&quot;right&quot;</code> 贴近「右下角」展开。
        </p>
        <Space.Compact>
          <Button type="default" onClick={() => console.log('主操作')}>
            操作
          </Button>
          <Dropdown
            trigger="click"
            verticalPanelAlign="right"
            dropdown={
              <MenuList role="menu">
                <MenuItem onClick={() => console.log('click', '1')}>第一项</MenuItem>
                <MenuItem onClick={() => console.log('click', '2')}>第二项</MenuItem>
                <MenuItem onClick={() => console.log('click', '3')}>第三项</MenuItem>
              </MenuList>
            }
          >
            <Button
              type="default"
              chevronDown={false}
              class="px-2.5"
              aria-label="更多操作"
              icon={<IconGlyph name="more" size={16} />}
            />
          </Dropdown>
        </Space.Compact>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">菜单分组：与 Divider 组合</h3>
        <p class="text-sm vfui-text-muted mb-4">
          在 <code class="text-xs">MenuList</code> 中穿插 <code class="text-xs">Divider</code> 可快速表达分组层级。
        </p>
        <Dropdown
          trigger="click"
          dropdown={
            <MenuList role="menu" class="min-w-56">
              <MenuItem>新建</MenuItem>
              <MenuItem>打开最近</MenuItem>
              <Divider spacing="none" />
              <MenuItem>重命名</MenuItem>
              <MenuItem>移动到</MenuItem>
              <Divider spacing="none" />
              <MenuItem>删除</MenuItem>
            </MenuList>
          }
        >
          <Button type="default">分组菜单</Button>
        </Dropdown>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-3">选项紧凑布局（menuColumnCompact）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          通过 <code class="text-xs">menuColumnCompact</code> 与 <code class="text-xs">MenuItem density=&quot;compact&quot;</code>{' '}
          联动，让下拉项在保持可读性的前提下更紧凑。
        </p>
        <Dropdown
          trigger="click"
          menuColumnCompact
          dropdown={
            <MenuList role="menu" class="min-w-52">
              <MenuItem density="compact">紧凑项 A</MenuItem>
              <MenuItem density="compact">紧凑项 B</MenuItem>
              <MenuItem density="compact">紧凑项 C</MenuItem>
              <Divider spacing="none" />
              <MenuItem density="compact">更多设置</MenuItem>
            </MenuList>
          }
        >
          <Button type="default">紧凑菜单</Button>
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
          getHorizontalTopMinFrom={() => horizontalTopRef.value}
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
                dropdown={
                  <MenuList role="menu" class="min-w-44">
                    <MenuItem>复制路径</MenuItem>
                    <MenuItem>在终端打开</MenuItem>
                    <Dropdown
                      block
                      trigger="click"
                      orientation="horizontal"
                      horizontalAlign="right"
                      dropdown={
                        <MenuList role="menu" class="min-w-40">
                          <MenuItem>UTF-8</MenuItem>
                          <MenuItem>GBK</MenuItem>
                        </MenuList>
                      }
                    >
                      <MenuItem chevronRight>编码</MenuItem>
                    </Dropdown>
                  </MenuList>
                }
              >
                <MenuItem chevronRight>更多</MenuItem>
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
                dropdown={
                  <MenuList role="menu" class="min-w-40">
                    <MenuItem>成员</MenuItem>
                    <MenuItem>账单</MenuItem>
                  </MenuList>
                }
              >
                <MenuItem chevronRight>设置</MenuItem>
              </Dropdown>
            </MenuList>
          }
        >
          <Button type="default">工作区（悬停 + 子菜单）</Button>
        </Dropdown>
      </section>

      <Divider/>
      <h2 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Hover / 嵌套 / 组合（调试用）</h2>
      <p class="text-sm vfui-text-muted mb-8">
        覆盖根级排他、嵌套不参与根排他、与点击混排等。后续若 hover/Portal 有回归，可在此逐项对照。
      </p>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-2">1. 两枚根级悬停，排他（移入 B 时 A 应收起）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          同屏两个 <code class="text-xs">trigger=&quot;hover&quot;</code>、均非嵌套；指针从「根 A」按钮移到「根 B」时，A 的浮层应关闭，只保留 B。
        </p>
        <div class="flex flex-wrap gap-4 items-center rounded-lg border border-dashed border-gray-300 dark:border-slate-600 p-4">
          <Dropdown
            trigger="hover"
            dropdown={
              <MenuList role="menu" class="min-w-40">
                <MenuItem>根 A-1</MenuItem>
                <MenuItem>根 A-2</MenuItem>
              </MenuList>
            }
          >
            <Button type="default">根 A 悬停</Button>
          </Dropdown>
          <Dropdown
            trigger="hover"
            dropdown={
              <MenuList role="menu" class="min-w-40">
                <MenuItem>根 B-1</MenuItem>
                <MenuItem>根 B-2</MenuItem>
              </MenuList>
            }
          >
            <Button type="primary">根 B 悬停</Button>
          </Dropdown>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-2">2. 根点击 + 根悬停 并排</h3>
        <p class="text-sm vfui-text-muted mb-4">
          根级 <code class="text-xs">hover</code> 互斥（再移入他根时上一枚根级悬停会收）。根级
          <code class="text-xs">click</code> 不参与：未点「页面其它处」时仅移入他根，左侧由点击打开的根可保持。嵌套的 <code class="text-xs">hover</code>
          子菜单仍应在指针离开子区域时自收（见各层 pointermove 逻辑）。
        </p>
        <div class="flex flex-wrap gap-4 items-center rounded-lg border border-dashed border-gray-300 dark:border-slate-600 p-4">
          <Dropdown
            trigger="click"
            dropdown={
              <MenuList role="menu" class="min-w-40">
                <MenuItem>点 opening-1</MenuItem>
                <MenuItem>点 opening-2</MenuItem>
              </MenuList>
            }
          >
            <Button type="default">根 · 点击</Button>
          </Dropdown>
          <Dropdown
            trigger="hover"
            dropdown={
              <MenuList role="menu" class="min-w-40">
                <MenuItem>根 · 悬停-1</MenuItem>
                <MenuItem>根 · 悬停-2</MenuItem>
              </MenuList>
            }
          >
            <Button type="primary">根 · 悬停</Button>
          </Dropdown>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-2">3. 根悬停 + 子悬停（两层层级，均 hover）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          子级有 <code class="text-xs">VfuiDropdownNestToken</code> 时不参与根级排他。验证：A、B 两枚根级悬停互斥时，子菜单全悬停时父不应被互斥误关。操作：根展开 →
          移入子项浮层开二级 → 在二级内移动/移回一级。
        </p>
        <div class="rounded-lg border border-dashed border-gray-300 dark:border-slate-600 p-4 inline-block">
          <Dropdown
            trigger="hover"
            dropdown={
              <MenuList role="menu" class="min-w-48">
                <MenuItem>仅一级项</MenuItem>
                <Dropdown
                  block
                  trigger="hover"
                  orientation="horizontal"
                  horizontalAlign="right"
                  dropdown={
                    <MenuList role="menu" class="min-w-44">
                      <MenuItem>二级悬停 A</MenuItem>
                      <MenuItem>二级悬停 B</MenuItem>
                    </MenuList>
                  }
                >
                  <MenuItem chevronRight>子菜单（全悬停）</MenuItem>
                </Dropdown>
              </MenuList>
            }
          >
            <Button type="default">根悬停 → 子悬停</Button>
          </Dropdown>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-2">4. 根悬停 + 子点 + 孙悬停（三层层级，混合 trigger）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          与「多级（点击）」同结构，将第二、三层的 <code class="text-xs">trigger</code> 换为
          <code class="text-xs">hover</code> 或 <code class="text-xs">click</code>，测 Portal 与嵌套计时。孙级为悬停时，在「子→孙」间移动应无父级被误关。
        </p>
        <div class="rounded-lg border border-dashed border-gray-300 dark:border-slate-600 p-4 inline-block">
          <Dropdown
            trigger="hover"
            dropdown={
              <MenuList role="menu" class="min-w-52">
                <MenuItem>一层项</MenuItem>
                <Dropdown
                  block
                  trigger="click"
                  orientation="horizontal"
                  horizontalAlign="right"
                  dropdown={
                    <MenuList role="menu" class="min-w-44">
                      <MenuItem>二层（点）</MenuItem>
                      <Dropdown
                        block
                        trigger="hover"
                        orientation="horizontal"
                        horizontalAlign="right"
                        dropdown={
                          <MenuList role="menu" class="min-w-40">
                            <MenuItem>三层悬停-1</MenuItem>
                            <MenuItem>三层悬停-2</MenuItem>
                          </MenuList>
                        }
                      >
                        <MenuItem chevronRight>更多（子点·孙悬停）</MenuItem>
                      </Dropdown>
                    </MenuList>
                  }
                >
                  <MenuItem chevronRight>子（点击开）</MenuItem>
                </Dropdown>
              </MenuList>
            }
          >
            <Button type="primary">根悬 / 子点 / 孙悬</Button>
          </Dropdown>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-sm font-medium vfui-text-muted mb-2">5. 根点击 + 子悬停 + 孙点击（子级不触发根排他）</h3>
        <p class="text-sm vfui-text-muted mb-4">
          子级是嵌套 <code class="text-xs">Dropdown</code>。先 <code class="text-xs">click</code> 打开本根，再展开
          <code class="text-xs">hover</code> 子与 <code class="text-xs">click</code> 孙：在孙级仍展开时，父根（点击）不应被误关；父级若为悬停则规则 2c
          要求「子弹出层（点击）未关前父悬停层也不能关」。再仅移入「另一根悬停」时，第一个根保持、子悬停应收起。
        </p>
        <div class="flex flex-wrap gap-4 items-start rounded-lg border border-dashed border-gray-300 dark:border-slate-600 p-4">
          <Dropdown
            trigger="click"
            dropdown={
              <MenuList role="menu" class="min-w-52">
                <MenuItem>项</MenuItem>
                <Dropdown
                  block
                  trigger="hover"
                  orientation="horizontal"
                  horizontalAlign="right"
                  dropdown={
                    <MenuList role="menu" class="min-w-40">
                      <MenuItem>孙级前步</MenuItem>
                      <Dropdown
                        block
                        trigger="click"
                        orientation="horizontal"
                        horizontalAlign="right"
                        dropdown={
                          <MenuList role="menu" class="min-w-36">
                            <MenuItem>再深一层</MenuItem>
                          </MenuList>
                        }
                      >
                        <MenuItem chevronRight>子悬停·孙点</MenuItem>
                      </Dropdown>
                    </MenuList>
                  }
                >
                  <MenuItem chevronRight>子（悬停）</MenuItem>
                </Dropdown>
              </MenuList>
            }
          >
            <Button type="default">根点/子悬/孙点</Button>
          </Dropdown>
          <Dropdown
            trigger="hover"
            dropdown={
              <MenuList role="menu" class="min-w-36">
                <MenuItem>他根-1</MenuItem>
                <MenuItem>他根-2</MenuItem>
              </MenuList>
            }
          >
            <Button type="primary">另一根悬停</Button>
          </Dropdown>
        </div>
      </section>
    </div>
  )
}
