const VFUI_OVERLAY_Z_INDEX_KEY = '__vfuiOverlayZIndexSeed__'
const VFUI_OVERLAY_Z_INDEX_BASE = 4000

export function acquireOverlayZIndex(): number {
  const g = globalThis as typeof globalThis & {
    [VFUI_OVERLAY_Z_INDEX_KEY]?: number
  }
  const current = g[VFUI_OVERLAY_Z_INDEX_KEY] ?? VFUI_OVERLAY_Z_INDEX_BASE
  const next = current + 1
  g[VFUI_OVERLAY_Z_INDEX_KEY] = next
  return next
}
