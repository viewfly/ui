import type { RouteConfig } from '@viewfly/router'
import { ButtonPage } from './pages/ButtonPage'
import { DividerPage } from './pages/DividerPage'
import { DropdownPage } from './pages/DropdownPage'
import { TooltipPage } from './pages/TooltipPage'
import { SliderPage } from './pages/SliderPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

export const routes: RouteConfig[] = [
  { path: '', component: HomePage },
  { path: 'button', component: ButtonPage },
  { path: 'divider', component: DividerPage },
  { path: 'dropdown', component: DropdownPage },
  { path: 'tooltip', component: TooltipPage },
  { path: 'slider', component: SliderPage },
  { path: '*', component: NotFoundPage },
]
