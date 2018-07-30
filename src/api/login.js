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
      'client_id': 2,
      'client_secret': 'eVwdRGgh0LE8lwVGj1bH6WDUB5nKvrrKGVj86Kjd'
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
