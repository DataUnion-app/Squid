import Vue from 'vue'
import App from './App.vue'
import Vuesax from 'vuesax'
import 'boxicons';
import 'boxicons/css/boxicons.css'
import '@/index.css'
import 'vuesax/dist/vuesax.css' //Vuesax styles
import router from './router';
import store from './store';
import Auth from '@/utils/auth';
import './component';
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import vClickOutside from 'v-click-outside'
 
Vue.use(vClickOutside)
Vue.use(VueViewer)
Vue.use(Vuesax, {
})

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

window.addEventListener("load", () => {
  Auth.login();
});

export default app;