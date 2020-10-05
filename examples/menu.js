export default [
  {
    id: 'homePage',
    title: '首页',
    icon: 'el-icon-star-off',
    route: '/home',
  },
  {
    id: 'split',
    title: '分割面板',
    route: '/split',
    icon: 'el-icon-crop',
    children: [{ id: 'split_1', title: '测试示例一', route: '/split' }],
  },
  {
    id: 'route',
    title: '嵌套子路由',
    route: '/nested',
    icon: 'el-icon-loading',
  },
]
