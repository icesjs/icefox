<template>
  <ice-basic-layout horizontal>
    <ice-layout-aside fixed collapsible>
      <ice-logo-panel slot="header">
        <img slot="logo" src="../assets/logo.png" alt="logo" />
        <div slot="title">组件测试</div>
      </ice-logo-panel>
      <ice-aside-menu :menu-items="items" router />
    </ice-layout-aside>
    <ice-layout>
      <ice-layout-header>
        <nav-bar />
      </ice-layout-header>
      <ice-layout-content scrollable>
        <ice-tabs-view />
      </ice-layout-content>
    </ice-layout>
  </ice-basic-layout>
</template>

<script>
import NavBar from '../components/NavBar/index'
import menu from '../menu'

export default {
  name: 'index.route',
  redirect: '/home',
  components: { NavBar },

  data() {
    return {
      items: menu,
    }
  },
}
</script>
