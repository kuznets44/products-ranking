import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css';
import 'vue-material-slider/dist/vue-material-slider.css';
import VueMaterialSlider from 'vue-material-slider';
import AsyncComputed from 'vue-async-computed';
import vuetify from './plugins/vuetify';

import { store } from './store';

import App from './App.vue';
import ViewCatalogs from './views/ViewCatalogs';
import ViewManufacturers from './views/ViewManufacturers';
import ViewSellers from './views/ViewSellers';


Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(VueMaterialSlider);
Vue.use(VueRouter);
Vue.use(AsyncComputed);

const router = new VueRouter({
  base: __dirname,
  routes: [
    { path: '/catalogs/', component: ViewCatalogs },
    { path: '/catalogs/:code/:section/', component: ViewCatalogs },
    { path: '/catalogs/:code/', component: ViewCatalogs },
    { path: '/manufacturers/', component: ViewManufacturers },
    { path: '/sellers/', 
      component: ViewSellers,
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
