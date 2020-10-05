//
const appPresetOptions = { shippedProposals: true }

if (process.env.NODE_ENV === 'production') {
  Object.assign(appPresetOptions, {
    modules: false,
    useBuiltIns: 'usage',
    corejs: {
      version: 3,
      proposals: true,
    },
  })
  const runtimePluginOptions = {
    helpers: true,
    corejs: false,
    regenerator: true,
    absoluteRuntime: false,
    version: require('@babel/runtime/package.json').version,
  }
  module.exports = {
    presets: [['@babel/preset-env', appPresetOptions]],
    plugins: [
      '@babel/plugin-proposal-export-default-from',
      ['@babel/plugin-transform-runtime', runtimePluginOptions],
    ],
  }
} else {
  module.exports = {
    presets: [['@vue/babel-preset-app', appPresetOptions]],
    plugins: ['@babel/plugin-proposal-export-default-from'],
  }
}
