const projectRoot = 'examples'
module.exports = {
  pluginOptions: {
    preprocess: {
      moduleRoot: `${projectRoot}/views`,
      rootAppPath: `${projectRoot}/App.vue`,
      htmlTemplate: `${projectRoot}/index.html`,
      moduleEntry: `${projectRoot}/main.js`,
    },
    services: {
      notifier: false,
      mock: {
        path: `${projectRoot}/mock`,
      },
      theme: `${projectRoot}/theme/var.less`,
      svgIcon: `${projectRoot}/assets/icons`,
    },
  },
}
