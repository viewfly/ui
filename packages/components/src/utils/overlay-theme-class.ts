/**
 * Portal 默认挂在 `document.body` 时不在 `.vfui-dark` 子树内，无法继承主题 CSS 变量。
 * 根据触发器 DOM 是否在深色子树内，为面板根节点补挂 `vfui-dark`。
 */
export function resolveVfuiPortalThemeClass(triggerEl: HTMLElement | null | undefined): string {
  if (!triggerEl) return ''
  return triggerEl.closest('.vfui-dark') ? ' vfui-dark' : ''
}
