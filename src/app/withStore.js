import { toObject } from '@/utils/mixed'
import createStore from '../store'
import createApp from './createApp'

export default function createAppWithStore(base, global, plugins, abortWarn) {
  const { store: baseStore, ...baseApp } = toObject(base)
  const { store: globalStore, ...globalApp } = toObject(global)

  const store = createStore(baseStore, globalStore, plugins, abortWarn)

  return createApp({ ...baseApp, store }, globalApp, plugins)
}
