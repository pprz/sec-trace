import { createApp } from 'vue'
import App from './App.vue'
import TDesign from "tdesign-vue-next";
import TDesignChat from "@tdesign-vue-next/chat";
import router from './router/index.ts';
import './assets/styles/index.css'
import './assets/fonts/icomoon.css'

createApp(App).use(TDesign).use(TDesignChat).use(router).mount('#app')
