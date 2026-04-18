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
      </ul>
      <p class="text-sm text-gray-500 dark:text-slate-400 mt-8">
        @viewfly/ui-utils 示例：clamp(120, 0, 100) = {w}
      </p>
    </div>
  )
}
