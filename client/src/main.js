import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons'
const emitter = mitt();
const app = createApp(App)
app.config.globalProperties.emitter = emitter;

app.use(ElementPlus)
app.use(Icons)

app.mount('#app')
