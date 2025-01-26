'use strict'
const pipe = require('../lib/pipe.js')

module.exports = {
  async login(data) {
    pipe()(data)
  }
}