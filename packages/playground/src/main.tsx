import 'virtual:uno.css'
import { RouterModule } from '@viewfly/router'
import { createApp } from '@viewfly/platform-browser'
import { App } from './App'

createApp(<App />)
  .use(new RouterModule())
  .mount(document.getElementById('app')!)
