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

export function defaultDropdownContainer(): HTMLElement {
  return typeof document !== 'undefined' ? document.body : (null as unknown as HTMLElement)
}
