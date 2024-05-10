import request from "../utils/request.js"

export function getWeather() {
  request({
    url: '/api/user',
    method: 'get',
  })
}