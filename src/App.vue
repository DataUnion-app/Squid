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
    return {};
  },
  computed: {},
  methods: {},
  mounted() {
    // console.log(`app mounted`);
    Observer.$on("login", ({ account }) => {
      this.$store.dispatch("init");
    });
    Observer.$on("userLoggedOut", ({ account }) => {
      this.$store.dispatch("logOut");
    })
    Observer.$on("userSwitchedWallet", ({ account }) => {
      this.$store.dispatch("switchWallet", account);
    })
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
  height: 80px;
  width: calc(100% - 230px);
  background-color: RGB(244, 247, 248);
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
}

.header-title {
  padding: 20px;
  margin-left: 40px;
  font-weight: bold;
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

.coming-soon {
  text-align: center;
}

.add-dialog {
  width: 50%;
  min-width: 400px;
  max-height: 80%;
}

.main-body {
  margin-top: 80px;
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

.select-tag {
  max-width: 500px !important;
  width: 270px !important;
}
</style>
