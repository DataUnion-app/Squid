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

.header {
    height: 80px;
    width: 110%;
    margin-left: -45px;
    margin-top: -20px;
    background-color: RGB(238, 242, 245);
    display: flex;
    position: relative;
}

.header-title {
    padding: 20px;
    margin-left: 100px;
    font-weight: bold;
}

.header-child {
    width: 70%;
}

.header-edit-button {
    margin-left: 20px;
    margin-top: 30px
}

.header-icon {
    position: fixed;
    right: 50px;
    top:5px;
    padding: 30px;
}

.header-icon-item {
    margin-left: 20px;
}

.image-relative {
  height: 300px; 
  width: 300px; 
  position: relative;
}

.image {
    width: 100%;
    height:300px;
}

.image-detail {
    width: 100%;
    height: 350px;
}

.image-detail-left {
    width: 50%;
    min-width: 400px;
}

.image-detail-right {
    width: 50%;
    min-width: 400px;
    max-height: 80%
}

.comment {
    width: 100%;
    padding-top: 100%;
}

.comment-item {
    top: 0;
    left: 0;
}

.comment-avatar {
    min-width: 44px;
}

.add-dialog {
    width: 50%;
    min-width: 400px;
    max-height: 80%;
}

.main-body {
    margin-top: 10px;
    /* overflow-y: auto;
    height:700px; */
}

.sidebar {
    width:180px;
}

.sidebar-item {
    float: right; 
    margin-top: 5px;
}

.map-size {
    width: 100%;
    height: 700px;
}
</style>
