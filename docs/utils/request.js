import axios from 'axios'

const service = axios.create({
  baseURL: '/api',
  timeout: 60000,
  withCredentials: true,
});


// 添加请求拦截器
service.interceptors.request.use((config) => {

  // if (store.getters.token) {
  //   config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  // }

  return config;
}, (error) => {

  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use((response) => {

  return response.data
},
  (error) => {
    return Promise.reject(error);
  });

export default service;

