const mode = process.env.NODE_ENV

// function getExternals() {
//   if (mode === 'production') {
//     const deps = require('./package.json').peerDependencies
//     if (typeof deps === 'object') {
//       return Object.keys(deps).reduce((externals, lib) => {
//         externals[lib] = lib
//         return externals
//       }, {})
//     }
//   }
// }

function getNoParse() {
  if (mode === 'production') {
    const deps = require('./package.json').peerDependencies
    if (typeof deps === 'object') {
      const externals = Object.keys(deps)
      return (content) => externals.includes(content)
    }
  }
}

module.exports = {
  configureWebpack: {
    output: {
      // library: 'icefox',
      // libraryExport: 'default',
      libraryTarget: 'window',
    },
    externals: {
      'element-ui': {},
      vue: {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue',
      },
    },
    module: {
      noParse: getNoParse(),
    },
  },
}
