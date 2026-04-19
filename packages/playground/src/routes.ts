import type { RouteConfig } from '@viewfly/router'
import { ButtonPage } from './pages/ButtonPage'
import { DividerPage } from './pages/DividerPage'
import { InputPage } from './pages/InputPage'
import { DropdownPage } from './pages/DropdownPage'
import { TooltipPage } from './pages/TooltipPage'
import { SliderPage } from './pages/SliderPage'
import { SwitchPage } from './pages/SwitchPage'
import { CheckboxPage } from './pages/CheckboxPage'
import { RadioPage } from './pages/RadioPage'
import { SelectPage } from './pages/SelectPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

export const routes: RouteConfig[] = [
  { path: '', component: HomePage },
  { path: 'button', component: ButtonPage },
  { path: 'divider', component: DividerPage },
  { path: 'input', component: InputPage },
  { path: 'dropdown', component: DropdownPage },
  { path: 'tooltip', component: TooltipPage },
  { path: 'slider', component: SliderPage },
  { path: 'switch', component: SwitchPage },
  { path: 'checkbox', component: CheckboxPage },
  { path: 'radio', component: RadioPage },
  { path: 'select', component: SelectPage },
  { path: '*', component: NotFoundPage },
]
