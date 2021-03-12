import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css';
import 'vue-material-slider/dist/vue-material-slider.css';
import VueMaterialSlider from 'vue-material-slider';

//import vuetify from './plugins/vuetify';
//Vue.use(vuetify);

import { store } from './store';

import App from './App.vue';
import Catalogs from './components/Catalogs';
import Manufacturers from './components/Manufacturers';
import Sellers from './components/Sellers';
import vuetify from './plugins/vuetify';


Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(VueMaterialSlider);
Vue.use(VueRouter);

const router = new VueRouter({
  base: __dirname,
  routes: [
    { path: '/catalogs/', component: Catalogs },
    { path: '/catalogs/:code/', component: Catalogs },
    { path: '/manufacturers/', component: Manufacturers },
    { path: '/sellers/', 
      component: Sellers,
      props: store.getters.sellers
    },
    { path: '/', redirect: '/catalogs/' }
  ]
})

new Vue({
  render: h => h(App),
  router,
  vuetify,

  //vuetify
  store
}).$mount('#app')
