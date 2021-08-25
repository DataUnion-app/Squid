<template>
  <div id="app">
    <Sidebar class="sidebar" />
    <transition name="fade" mode="out-in">
      <router-view class="p-5 main" />
    </transition>
  </div>
</template>

<script>
import Sidebar from "@/views/Sidebar.vue";
import Observer from "@/utils/observer";
import API from "@/utils/api";

export default {
  name: "App",
  components: {
    Sidebar,
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
  },
  mounted() {
    Observer.$on("login", ({ account }) => {
      this.$store.dispatch("init");
    });
  },
};
</script>

<style>
body {
  overflow-y: hidden !important;
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
  opacity: 0;
}

*:not(i) {
  font-family: Nunito !important;
}

/* For Image Viewer Overlap Sidebar */
.viewer-container {
  z-index: 99999999 !important;
}

.icon-detail {
  margin-left: 100px !important;
}

.pop-menu {
  background-color: #1976d2 !important;
}

.pop-menu-plus {
  background-color: #4caf50 !important;
}

.pop-menu-heart {
  background-color: red !important;
}

.pop-menu-pencil {
  background-color: #3f51b5 !important;
}

.header {
  height: 110px;
  width: 110%;
  margin-left: -45px;
  margin-top: -20px;
  background-color: RGB(244, 247, 248);
  display: flex;
  position: relative;
}

.header-description {
  text-align: center;
  font-size: small;
}

.header-title-div {
  margin-left: 40px;
  margin-right: 15px;
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}

.header-title {
  text-align: center;
  font-weight: bold;
}

.option-inner-grid {
  
}

.center {
  text-align: center;
  align-content: center;
  align-items: center;
}

.header-edit-button {
  margin-left: 20px;
  margin-top: 15px;
}

.header-icon {
  position: absolute;
  right: 10%;
  padding: 20px;
}

.header-icon-item {
  margin-left: 5px;
  cursor: pointer;
}

.image-relative {
  height: 300px;
  width: 300px;
  position: relative;
}

.image {
  width: 100%;
  height: 300px;
}

.image-detail {
  width: 100%;
  height: 350px;
}

.image-detail-left {
  width: 50%;
}

.image-detail-right {
  width: 50%;
  min-width: 400px;
  max-height: 80%;
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
  margin-top: 25px;
  overflow-y: hidden;
}

.sidebar {
  width: 180px;
}

.sidebar-item {
  float: right;
  margin-top: 3px;
}

.map-size {
  margin-top: -20px;
  width: 103%;
  margin-left: -20px;
  height: 100vh;
}

.select-body {
  /* width: 100%; */
  margin-top: 20px;
}

.vs-body {
  margin-top: 10px;
  margin-left: 40px;
}

.select-tag{
  max-width: 500px !important;
  width: 270px !important;
}
</style>
