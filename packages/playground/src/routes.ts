import type { RouteConfig } from '@viewfly/router'
import { ButtonPage } from './pages/ButtonPage'
import { DividerPage } from './pages/DividerPage'
import { DropdownPage } from './pages/DropdownPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

export const routes: RouteConfig[] = [
  { path: '', component: HomePage },
  { path: 'button', component: ButtonPage },
  { path: 'divider', component: DividerPage },
  { path: 'dropdown', component: DropdownPage },
  { path: '*', component: NotFoundPage },
]
