'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost:8000/"',
  APP_ID: 2,
  APP_SECRET: 'eVwdRGgh0LE8lwVGj1bH6WDUB5nKvrrKGVj86Kjd'
})
