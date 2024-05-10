import axios from 'axios'

const server = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  timeout: 60000,
  withCredentials: true,
});


// 添加请求拦截器
server.interceptors.request.use(function (config) {

  // if (store.getters.token) {
  //   config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  // }

  return config;
}, function (error) {

  return Promise.reject(error);
});

// 添加响应拦截器
server.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

export default server;