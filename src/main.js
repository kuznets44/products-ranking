import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'vue-material-slider/dist/vue-material-slider.css';
import VueMaterialSlider from 'vue-material-slider';
//import VueSocketIO from 'vue-socket.io'
//import SocketIO from 'socket.io-client'

//const socketOptions = { path: '/live' }; //Options object to pass into SocketIO

/*
Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO('http://82.202.244.185:8089', socketOptions), //options object is Optional
  })
);
*/

Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(VueMaterialSlider);

new Vue({
  render: h => h(App),
}).$mount('#app')
