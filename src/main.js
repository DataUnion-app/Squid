import vuetify from '@/plugins/vuetify'
import Auth from '@/utils/auth';
import vClickOutside from 'v-click-outside'
import VueViewer from 'v-viewer'
import Vue from 'vue'
import Vuesax from 'vuesax'

import App from './App.vue'
//Vuesax styles
import router from './router';
import store from './store';

import VueYouTubeEmbed from 'vue-youtube-embed'

import './component';
import '@/index.css'
import 'boxicons';
import 'boxicons/css/boxicons.css'
import 'viewerjs/dist/viewer.css'
import 'vuesax/dist/vuesax.css'

// path to vuetify export

Vue.use(vClickOutside)
Vue.use(VueViewer)
Vue.use
Vue.use(Vuesax, {})
Vue.use(VueYouTubeEmbed)

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

window.addEventListener("load", () => {
  console.log(`window loaded`);
  Auth.checkForAccount();
  Auth.login();
});

export default app;