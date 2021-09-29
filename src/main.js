import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPaperclip, faSmile, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { VueSpinners } from '@saeris/vue-spinners'
import vueCustomElement from 'vue-custom-element'

Vue.use(vueCustomElement)
Vue.use(VueSpinners)
Vue.use(require('vue-moment'))

library.add(faPaperclip)
library.add(faSmile)
library.add(faLightbulb)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.customElement('wizard-chatbot', App)

// new Vue({
//   render: h => h(App)
// }).$mount('#app')
