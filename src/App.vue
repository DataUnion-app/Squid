<template>
  <div id="app">
    <Sidebar class="sidebar"/>
    <router-view class="p-5 main"/>
  </div>
</template>

<script>
import Sidebar from '@/views/Sidebar.vue';
import Observer from '@/utils/observer';

export default {
  name: 'App',
  components: {
    Sidebar
  },
  mounted() {
    Observer.$on('login', ({account}) => {
      this.$store.dispatch('init');
    })
  }
}
</script>

<style>
.main {
  margin-left: 260px;
}
</style>
