import { Link } from '@viewfly/router'
import { clamp } from '@viewfly/ui-utils'

export function HomePage() {
  const w = clamp(120, 0, 100)
  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">组件演示</h2>
      <p class="text-sm text-gray-600 dark:text-slate-400 mb-6">
        通过导航栏或下方入口进入各组件子页面。
      </p>
      <ul class="grid gap-3 sm:grid-cols-2 max-w-xl">
        <li>
          <Link
            to="/button"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">Button</span>
            <span class="block text-xs vfui-text-muted mt-1">语义、变体、尺寸、loading 等</span>
          </Link>
        </li>
        <li>
          <Link
            to="/divider"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">Divider</span>
            <span class="block text-xs vfui-text-muted mt-1">水平 / 垂直、虚线、文案位置</span>
          </Link>
        </li>
        <li>
          <Link
            to="/menu-list"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">MenuList</span>
            <span class="block text-xs vfui-text-muted mt-1">菜单/列表容器、项密度、与 Divider 组合</span>
          </Link>
        </li>
        <li>
          <Link
            to="/input"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">Input</span>
            <span class="block text-xs vfui-text-muted mt-1">单行输入、受控 / 非受控、尺寸与禁用</span>
          </Link>
        </li>
        <li>
          <Link
            to="/input-number"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">InputNumber</span>
            <span class="block text-xs vfui-text-muted mt-1">数字、步进按钮、前后缀组合</span>
          </Link>
        </li>
        <li>
          <Link
            to="/tooltip"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">Tooltip</span>
            <span class="block text-xs vfui-text-muted mt-1">上下左右 12 方位、悬停 / 聚焦</span>
          </Link>
        </li>
        <li>
          <Link
            to="/slider"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">Slider</span>
            <span class="block text-xs vfui-text-muted mt-1">范围、步长、受控 / 非受控、键盘</span>
          </Link>
        </li>
        <li>
          <Link
            to="/switch"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">Switch</span>
            <span class="block text-xs vfui-text-muted mt-1">开关、受控 / 非受控、禁用</span>
          </Link>
        </li>
        <li>
          <Link
            to="/checkbox"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">Checkbox</span>
            <span class="block text-xs vfui-text-muted mt-1">多选、文案、受控 / 非受控、禁用</span>
          </Link>
        </li>
        <li>
          <Link
            to="/radio"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">Radio</span>
            <span class="block text-xs vfui-text-muted mt-1">RadioGroup、受控 / 原生非受控、禁用</span>
          </Link>
        </li>
        <li>
          <Link
            to="/select"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">Select</span>
            <span class="block text-xs vfui-text-muted mt-1">下拉单选、受控 / 非受控、尺寸与禁用</span>
          </Link>
        </li>
        <li>
          <Link
            to="/color-picker"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">ColorPicker</span>
            <span class="block text-xs vfui-text-muted mt-1">预设色、调色盘、HSL / RGB / HEX 与透明度</span>
          </Link>
        </li>
        <li>
          <Link
            to="/space"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">Space</span>
            <span class="block text-xs vfui-text-muted mt-1">间距布局、换行、分隔、Space.Compact</span>
          </Link>
        </li>
        <li>
          <Link
            to="/tabs"
            class="block rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-4 py-3 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-slate-100">Tabs</span>
            <span class="block text-xs vfui-text-muted mt-1">标签页、受控 / 非受控、纵向与键盘</span>
          </Link>
        </li>
      </ul>
      <p class="text-sm text-gray-500 dark:text-slate-400 mt-8">
        @viewfly/ui-utils 示例：clamp(120, 0, 100) = {w}
      </p>
    </div>
  )
}
