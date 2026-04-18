import { Link } from '@viewfly/router'

export function NotFoundPage() {
  return () => (
    <div class="text-center py-16">
      <p class="text-sm vfui-text-muted mb-4">未找到该页面</p>
      <Link
        to="/"
        class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
        exact
      >
        返回首页
      </Link>
    </div>
  )
}
