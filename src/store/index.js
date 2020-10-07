import Vue from 'vue'
import globalShim from '@/utils/global'
import { formatSetup, hasOwnProperty, toObject } from '@/utils/mixed'
import { isESModule } from '@/utils/assert'
import injectActionCall from './inject'

// 安装vuex
function installVuex() {
  let Vuex
  // 这里是根据构建环境条件来进行vuex安装
  if (process.env.MODULE_BUILD === 'true') {
    // 模块化构建时，自动安装
    Vuex = require('vuex')
    if (isESModule(Vuex)) {
      Vuex = Vuex.default
    }
    Vue.use(Vuex)
  } else {
    // 非模块化构建，取全局模块
    Vuex = globalShim.Vuex
    if (!Vuex) {
      throw new Error(
        'Can not find the constructor of Vuex, you must install vuex first.\n(https://vuex.vuejs.org/installation.html)'
      )
    }
  }
  return Vuex
}

/**
 * 检查全局设置。
 * @param setup
 * @param abortWarn
 */
export function checkGlobalSetup(setup, abortWarn) {
  const storeProps = ['state', 'mutations', 'actions', 'getters', 'modules']
  const declared = storeProps.filter((prop) => hasOwnProperty(setup, prop))
  if (!abortWarn && declared.length) {
    setTimeout(
      () =>
        (Vue.$debug || console)['warn'](
          `The store properties defined in the main.js file will override the automatically generated properties.\n[${declared.join(
            '、'
          )}]`
        ),
      0
    )
  }
}

/**
 * 创建一个Store实例。
 * @param base 基础配置。
 * @param global 全局配置。
 * @param plugins 启用的内建插件列表。
 * @param abortWarn 忽略警告信息
 * @returns {Store<any>}
 */
export default function createStore(base, global, plugins, abortWarn = false) {
  // 安装
  const Vuex = installVuex()

  const { modules = {}, ...baseSetup } = toObject(base)
  const { created, ...globalSetup } = formatSetup(global)

  // 检查全局配置中的属性，并作出提示
  checkGlobalSetup(globalSetup, abortWarn)

  const options = {
    modules,
    state: {},
    ...toObject(baseSetup),
    ...toObject(globalSetup),
  }

  const store = new Vuex.Store(
    // store上下文中，我们注入call函数，可用进行promise化，或者根据服务发起请求
    injectActionCall(options, plugins)
  )

  const stub = '$store'

  // 全局保存实例对象
  Object.defineProperty(Vue, stub, {
    value: store,
  })

  // 如果有创建完成的回调函数，那就执行它
  if (typeof created === 'function') {
    created.call(store, store)
  }

  return store
}
