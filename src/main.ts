import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from '~/router/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//全局引入mapbox-gl的样式
import 'mapbox-gl/dist/mapbox-gl.css';
import contextmenu from "v-contextmenu";
import "v-contextmenu/dist/themes/default.css";
import 'mapbox-gl/dist/mapbox-gl.css';


createApp(App).
use(createPinia()).
use(router).
use(ElementPlus, {size: 'small', zIndex: 3000}).
use(contextmenu).
mount('#app')