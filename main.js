import Vue from 'vue'
import App from './App'

import store from './store'
import uView from 'uview-ui';
import myRequest from '@/request.js'
 //引入全局请求插件
import { http,api } from '@/config/common.js' // 全局挂载引入，配置相关在该index.js文件里修改
Vue.prototype.$http = http
Vue.prototype.$api = api
Vue.prototype.$myRequest = myRequest

Vue.use(uView);

Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
