import 'virtual:uno.css'
import { RouterModule } from '@viewfly/router'
import { createApp } from '@viewfly/platform-browser'
import { App } from './App'
import { routes } from './routes'

createApp(<App />)
  .use(
    new RouterModule({
      routes,
    }),
  )
  .mount(document.getElementById('app')!)
