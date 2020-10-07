import { toObject } from '@/utils/mixed'
import createRouter from '../router'
import createApp from './createApp'

export default function createAppWithRouter(base, global, plugins, abortWarn) {
  const { router: baseRouter, ...baseApp } = toObject(base)
  const { router: globalRouter, ...globalApp } = toObject(global)

  const router = createRouter(baseRouter, globalRouter, abortWarn)

  return createApp({ ...baseApp, router }, globalApp, plugins)
}
