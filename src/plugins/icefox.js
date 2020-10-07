import globalShim from '@/utils/global'
import components from '../components'

// 标记插件是否已经安装
let installed = false

// 导出插件名称（供umd模块使用）
export const name = 'icefox'

// 导出版本号（供umd模块使用）
export const version = process.env.ICEFOX_VERSION

// 导出安装方法（供umd模块使用）
export function install(Vue, opts) {
  // 保存全局配置
  // 可多次调用install修改全局配置
  Object.defineProperty(Vue.prototype, '$ICEFOX', {
    value: Object.freeze({ ...Object.assign({}, opts) }),
    writable: true,
  })

  if (installed) {
    return
  }

  // 安装所有组件
  components.forEach((component) => {
    if (typeof component.install === 'function') {
      component.install(Vue)
    }
  })
  // 标记为已安装
  installed = true
}

// 导出插件（供模块构建器使用）
export default { name, version, install }

// 非模块构建（直接在浏览器端使用），默认通过全局Vue安装此插件
if (process.env.MODULE_BUILD !== 'true') {
  const GlobalVue = globalShim.Vue
  if (GlobalVue) {
    install(GlobalVue)
  }
}
