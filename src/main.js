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
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueViewer)
Vue.use(Vuesax, {
})

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBN0tTc5wqVuzgrO5_qxqf7yHrRbxcWUss',
    libraries: 'places',
  }
});

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