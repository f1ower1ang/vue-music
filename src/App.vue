<template>
  <div id="app" ref="app">
    <m-header/>
    <tab/>
    <keep-alive exclude="User-center">
      <router-view></router-view>
    </keep-alive>
    <player/>
    <message-box />
  </div>
</template>

<script>
  import MHeader from './components/MHeader/MHeader'
  import Player from './components/Player/Player'
  import Tab from './components/Tab/tab'
  import MessageBox from './base/message-box/message-box'

  export default {
    name: 'App',
    components: {MHeader, Tab, Player,MessageBox},
    mounted() {
      this.$refs.app.addEventListener('touchstart', function () {
      });
    }
  }
</script>
<style lang="stylus">
  @import "common/stylus/variable.styl";
  #app
    padding-top 20px
</style>
