import { createEffect, createSignal } from '@viewfly/core'
import { Link, RouterOutlet } from '@viewfly/router'
import { routes } from './routes'

const linkBase =
  'block rounded-md px-3 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700/80 transition-colors'
const linkActive =
  'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 font-medium'

export function App() {
  const dark = createSignal(false)
  createEffect(() => dark(), (isDark) => {
    document.documentElement.classList.toggle('dark', isDark)
  })

  return () => (
    <div class="vfui-page min-h-screen p-6 md:p-8 font-sans transition-colors duration-200">
      <header class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-3">
          <Link to="/" class="text-xl font-semibold text-primary-600 dark:text-primary-400 hover:opacity-90" exact>
            ViewflyUI · Viewfly
          </Link>
          <span class="hidden sm:inline text-xs vfui-text-muted">演示（History 路由）</span>
        </div>
        <button
          type="button"
          class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          onClick={() => dark.set(!dark())}
        >
          {dark() ? '切换为浅色' : '切换为深色'}
        </button>
      </header>

      <div class="flex flex-col md:flex-row gap-8 md:gap-10">
        <nav class="shrink-0 md:w-44 flex flex-row md:flex-col flex-wrap md:flex-nowrap gap-1 border-b md:border-b-0 md:border-r border-gray-200 dark:border-slate-700 pb-4 md:pb-0 md:pr-6">
          <Link to="/" class={linkBase} active={linkActive} exact>
            首页
          </Link>
          <Link to="/button" class={linkBase} active={linkActive}>
            Button
          </Link>
          <Link to="/divider" class={linkBase} active={linkActive}>
            Divider
          </Link>
          <Link to="/input" class={linkBase} active={linkActive}>
            Input
          </Link>
          <Link to="/input-number" class={linkBase} active={linkActive}>
            InputNumber
          </Link>
          <Link to="/dropdown" class={linkBase} active={linkActive}>
            Dropdown
          </Link>
          <Link to="/tooltip" class={linkBase} active={linkActive}>
            Tooltip
          </Link>
          <Link to="/slider" class={linkBase} active={linkActive}>
            Slider
          </Link>
          <Link to="/switch" class={linkBase} active={linkActive}>
            Switch
          </Link>
          <Link to="/checkbox" class={linkBase} active={linkActive}>
            Checkbox
          </Link>
          <Link to="/radio" class={linkBase} active={linkActive}>
            Radio
          </Link>
          <Link to="/select" class={linkBase} active={linkActive}>
            Select
          </Link>
        </nav>

        <main class="flex-1 min-w-0">
          <RouterOutlet config={routes} />
        </main>
      </div>
    </div>
  )
}
