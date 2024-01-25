import { createApp } from 'vue'
import { createPinia } from 'pinia'
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

import App from './App.vue'
import router from './router'

import utils from './utils';

//Add your Frappe backend's URL
const frappe = new utils.Frappe("url", "id") //url and id goes in here
const notify = new utils.Notify(Swal);


const app = createApp(App)

app.config.globalProperties.frappe = frappe;
app.config.globalProperties.notify = notify;
app.config.globalProperties.dataBank = {};
app.config.globalProperties.loader = {
    start: ()=>{
        document.getElementById('loader').setAttribute("style", "display: block;")
    },
    end: ()=>{
        setTimeout(() => {
            document.getElementById('loader').setAttribute("style", "pointer-events: none; opacity: 0; transition: 0.2s ease-in-out;");
            setTimeout(() => {
                document.getElementById('loader').setAttribute("style", "display: none;")
            }, 1000);
        }, 450);
    }
}
app.config.globalProperties.generate_hash = (length)=>{
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
app.config.globalProperties.is_logged_in = ()=>{
    try {
        JSON.parse(localStorage.frappeUser).token
    } catch (e) {
        window.location.href = '/'
    }
    
}
app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
