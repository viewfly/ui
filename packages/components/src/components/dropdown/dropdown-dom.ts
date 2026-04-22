/** 可产生纵向/横向滚动的祖先（不含 body 之上的默认文档流，由 window 覆盖） */
export function getScrollableAncestors(el: HTMLElement): HTMLElement[] {
  const list: HTMLElement[] = []
  let p: HTMLElement | null = el.parentElement
  while (p) {
    const st = getComputedStyle(p)
    const scrolls = (v: string) => v === 'auto' || v === 'scroll' || v === 'overlay'
    if (scrolls(st.overflowY) || scrolls(st.overflowX) || scrolls(st.overflow)) {
      list.push(p)
    }
    p = p.parentElement
  }
  return list
}

/** 若触发器位于某个 Popover 面板内，则返回该 Popover 的实例 id。 */
export function resolveOwnerPopoverId(el: HTMLElement | null | undefined): string | null {
  if (!el) return null
  const owner = el.closest('[data-vfui-popover-id]') as HTMLElement | null
  return owner?.dataset.vfuiPopoverId ?? null
}

export function defaultDropdownContainer(): HTMLElement {
  return typeof document !== 'undefined' ? document.body : (null as unknown as HTMLElement)
}
