<template>
  <div id="app">
    <Sidebar class="sidebar"/>
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view class="p-5 main"/>
    </transition>
    <!-- <router-view class="p-5 main"/> -->
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
body {
  overflow-y: hidden!important;
  overflow-x: hidden;
}
.main {
  margin-left: 260px;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

*:not(i){
      font-family: Nunito!important;
}

/* For Image Viewer Overlap Sidebar */
.viewer-container {
  z-index: 99999999!important;
}
</style>
