import createAppFull from './full'
import createAppOnly from './only'
import createAppWithRouter from './withRouter'
import createAppWithStore from './withStore'

export function createApp(global, plugins) {
  const { router, store } = Object.assign({}, global)
  if (!router && !store) {
    return createAppOnly(null, global, plugins)
  } else if (!router) {
    return createAppWithStore(null, global, plugins, true)
  } else if (!store) {
    return createAppWithRouter(null, global, plugins, true)
  } else {
    return createAppFull(null, global, plugins, true)
  }
}
