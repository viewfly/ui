import { ICON_GLYPH_NAMES, IconGlyph, type IconGlyphName } from '@viewfly/ui-icons'

const names = (ICON_GLYPH_NAMES as readonly IconGlyphName[]).slice().sort()

export function IconsPage() {
  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">Icons</h2>
      <p class="text-sm vfui-text-muted mb-6">内置图标字形一览（{names.length} 个）</p>

      <div class="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
        {names.map((name) => (
          <div
            key={name}
            class="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-3"
          >
            <IconGlyph name={name} size={28} class="text-gray-800 dark:text-slate-100 shrink-0" />
            <span class="text-xs text-center text-gray-600 dark:text-slate-400 break-all leading-tight">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
