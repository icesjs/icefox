// rollup构建配置定义
// 仅在产品模式构建时使用rollup打包

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const exportsName = 'Icefox' // 全局环境导出的变量名
const entry = 'src/index.js' // 打包构建入口

// 外部引用模块的全局变量
// 在浏览器端引用本库时，从全局变量获取下面所列的第三方库
// 如：{jquery: '$', lodash: '_'}
const globals = {
  vue: 'Vue',
  vuex: 'Vuex',
  'vue-router': 'VueRouter',
  'element-ui': 'ELEMENT',
}

// 模块路径解析别名定义
// 相对于工程根目录
const resolveAlias = {
  '@': 'src',
}

// 代码中使用到的环境变量声明
const envData = {
  NODE_ENV: 'production',
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import vue from 'rollup-plugin-vue'
import url from '@rollup/plugin-url'
import less from 'rollup-plugin-less'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

// 正则表达式转义辅助函数
function escapeRegExpCharacters(str) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
}

// 辅助声明环境变量
// 已定义的环境变量可以在代码中引用
function defineEnv(env) {
  const defined = {}
  for (const [key, val] of Object.entries(env)) {
    defined[`process.env.${key}`] = JSON.stringify(val.toString())
  }
  return defined
}

// 获取使用es模块模式打包时声明的外部依赖
function getExternalsModule(noDependencies) {
  const externals = Array.from(
    new Set([
      ...(noDependencies ? [] : Object.keys(pkg.dependencies || {})),
      ...Object.keys(pkg.peerDependencies || {}),
    ])
  ).filter((dep) => !!dep.trim())
  if (!externals.length) {
    return () => false
  }
  const pattern = new RegExp(
    `^(?:${externals.map(escapeRegExpCharacters).join('|')})(?:$|\\\\|/)`
  )
  return (id) => {
    return pattern.test(id)
  }
}

// 辅助解析没有带后缀(.vue)的vue文件
function rollupPluginVueResolve() {
  return {
    resolveId(source, importer) {
      if (importer) {
        const file = path.join(path.dirname(importer), source)
        if (!/[^.]+\.[^.]+$/.test(source) && fs.existsSync(`${file}.vue`)) {
          return `${file}.vue`
        }
      }
      return null
    },
  }
}

// 将解析别名转换为绝对路径
function transformResolveAlias(alias) {
  const entries = {}
  for (const [key, val] of Object.entries(alias)) {
    const absPath = path.resolve(`${val}`)
    try {
      if (fs.statSync(absPath).isDirectory()) {
        entries[key] = `${absPath.replace(/[/\\]+$/, '')}${path.sep}.${
          path.sep
        }`
        continue
      }
    } catch (e) {
      console.error(e.message)
    }
    entries[key] = absPath
  }
  return entries
}

// 需要进行构建处理的资源扩展名
const resolveExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue']

const argv = minimist(process.argv.slice(2))

// 判断是否使用指定的格式打包
function allowFormat(format) {
  const f = argv.format || argv.f
  return !f || (format instanceof RegExp ? format.test(f) : format === f)
}

const baseConfig = {
  input: entry,
  plugins: {
    beforeVue: [
      alias({
        resolve: resolveExtensions,
        entries: transformResolveAlias(resolveAlias),
      }),
      json(),
      rollupPluginVueResolve(),
      resolve(),
      url(),
      less({
        insert: true,
        output: false,
      }),
    ],
    replace: defineEnv({
      ...envData,
      ES_BUILD: false,
    }),
    vue: {
      css: true,
      template: {
        isProduction: true,
      },
      normalizer: '~vue-runtime-helpers/dist/normalize-component.js',
      styleInjector: '~vue-runtime-helpers/dist/inject-style/browser.js',
      styleInjectorSSR: '~vue-runtime-helpers/dist/inject-style/server.js',
      styleInjectorShadow: '~vue-runtime-helpers/dist/inject-style/shadow.js',
    },
    babel: {
      exclude: 'node_modules/**',
      extensions: resolveExtensions,
      babelHelpers: 'runtime',
    },
  },
}

const buildFormats = []

// es module打包（webpack@2+、Rollup）
if (allowFormat(/esm?/)) {
  buildFormats.push({
    ...baseConfig,
    external: getExternalsModule(),
    output: {
      format: 'esm',
      file: pkg.module,
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      replace({
        ...baseConfig.plugins.replace,
        ...defineEnv({
          ES_BUILD: true,
        }),
      }),
      ...baseConfig.plugins.beforeVue,
      vue(baseConfig.plugins.vue),
      babel({
        ...baseConfig.plugins.babel,
        babelHelpers: 'runtime',
      }),
      commonjs(),
    ],
  })
}

// common js模块打包（webpack@1、Browserify ）
if (allowFormat('cjs')) {
  buildFormats.push({
    ...baseConfig,
    external: getExternalsModule(),
    output: {
      format: 'cjs',
      compact: true,
      file: pkg.main,
      name: exportsName,
      exports: 'named',
      globals,
      sourcemap: true,
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.beforeVue,
      vue({
        ...baseConfig.plugins.vue,
        template: {
          ...baseConfig.plugins.vue.template,
          optimizeSSR: true,
        },
      }),
      babel({
        ...baseConfig.plugins.babel,
        babelHelpers: 'runtime',
      }),
      commonjs(),
    ],
  })
}

// umd模块打包（Browser）
if (allowFormat(/umd|iife/)) {
  buildFormats.push({
    ...baseConfig,
    external: getExternalsModule(true),
    output: {
      format: 'iife',
      compact: true,
      file: pkg.browser,
      name: exportsName,
      exports: 'named',
      globals,
      sourcemap: true,
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.beforeVue,
      vue(baseConfig.plugins.vue),
      babel({
        ...baseConfig.plugins.babel,
      }),
      commonjs(),
      terser({
        output: {
          ecma: 5,
        },
      }),
    ],
  })
}

export default buildFormats
