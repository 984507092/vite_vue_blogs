import request from "../utils/request.js"

export function getWeather(params) {
  return request({
    url: '/user',
    method: 'get',
    params
  })
}