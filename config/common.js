import Request from '@/utils/luch-request/index.js'
export const apiBaseUrl = 'http://www.baidu.com'
const api = new Request()
const http = new Request()
export {
  http,
  api
}
http.config.header = {website:'123dfdf465132'}
api.config.header={aaaaaaa:'sdfsdfsdfsdfsd'}
api.setConfig((config) => { /* 设置全局配置 */
  config.baseURL = 'https://www.fastmock.site/mock/26243bdf9062eeae2848fc67603bda2d/luchrequest'
  config.header = {
    ...config.header,
    a: 1111111, // 演示
    b: 2222 // 演示
  }
  dataType: 'json'
  // 注：如果局部custom与全局custom有同名属性，则后面的属性会覆盖前面的属性，相当于Object.assign(全局，局部)
  custom: {auth: true} // 可以加一些自定义参数，在拦截器等地方使用。比如这里我加了一个auth，可在拦截器里拿到，如果true就传token
  // #ifndef MP-ALIPAY || APP-PLUS
  responseType: 'text'
  // #endif
  // #ifdef MP-ALIPAY || MP-WEIXIN
  timeout: 30000 // 仅微信小程序（2.10.0）、支付宝小程序支持
  // #endif
  // #ifdef APP-PLUS
  sslVerify: true // 验证 ssl 证书 仅5+App安卓端支持（HBuilderX 2.3.3+）
  // #endif
  // #ifdef H5
  withCredentials: false // 跨域请求时是否携带凭证（cookies）仅H5支持（HBuilderX 2.6.15+）
  // #endif
  // 返回当前请求的task, options。请勿在此处修改options。非必填
  getTask: (task, options) => {
       // setTimeout(() => {
       //   task.abort()
       // }, 500)
  }
  // 自定义验证器。statusCode必存在。非必填
  validateStatus:(statusCode)=> {
     return statusCode >= 200 && statusCode < 300
  }
  return config
})

//我这里 用的api跟项目对应
//请求前拦截，用来动态加参
api.interceptors.request.use((config) => { // 可使用async await 做异步操作
  config.baseURL = apiBaseUrl
  config.header = {
    ...config.header,
    // 'testaaa': '11' // 演示拦截器header加参
  }

  // 演示custom 用处
  // if (config.custom.auth) {
  //   config.header.token = 'token'
  // }
  // if (config.custom.loading) {
  //  uni.showLoading()
  // }
  /**
   /* 演示
   if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
      return Promise.reject(config)
    }
   **/
  return config
}, config => { // 可使用async await 做异步操作
  return Promise.reject(config)
})


// 请求后
api.interceptors.response.use((response) => {
  console.log(response)
  return response
}, (response) => { /*  对响应错误做点什么 （statusCode !== 200）*/
  console.log(response)
  console.log(response.statusCode);
  //未登录时清空缓存跳转
  if(response.statusCode ==401){
	  uni.clearStorageSync();
	  uni.switchTab({
	  	url:"/pages/login/login"
	  })
  }
  return Promise.reject(response)
})