import { Component, Injectable } from '@viewfly/core'
import { Subject } from '@tanbo/stream'

@Injectable({
  provideIn: 'root',
})
export class DropdownNestContext {
  onSiblingDropdownOpen = new Subject<Component>()
  onSubPanelClicked = new Subject<void>()
  onSubDropdownOpened = new Subject<void>()
  onSubDropdownClosed = new Subject<void>()
  onMouseEnterSubPanel = new Subject<void>()
  onMouseLeaveSubPanel = new Subject<void>()
}
