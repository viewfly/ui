import { createContextProvider, InjectionToken } from '@viewfly/core'

export interface VfuiDropdownNestContext {
  onSubPanelClicked(): void

  onSubDropdownOpened(): void

  onSubDropdownClosed(): void

  onMouseEnterSubPanel(): void

  onMouseLeaveSubPanel(): void
}

export const VfuiDropdownNestToken = new InjectionToken<VfuiDropdownNestContext>('VfuiDropdownNest')

export const VfuiDropdownNestProvider = createContextProvider({provide: VfuiDropdownNestToken})
