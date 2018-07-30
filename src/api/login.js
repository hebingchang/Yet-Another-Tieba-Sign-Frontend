import request from '@/utils/request'
var querystring = require('querystring')

export function login(username, password) {
  return request({
    url: '/oauth/token',
    method: 'post',
    data: querystring.stringify({
      'username': username + '@boar.tech',
      'password': password,
      'grant_type': 'password',
      'client_id': process.env.APP_ID,
      'client_secret': process.env.APP_SECRET
    })
  })
}

export function getInfo() {
  return request({
    url: '/api/user',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}
