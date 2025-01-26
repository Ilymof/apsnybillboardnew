'use strict'

const db = require('db.js')
const cities = db('city')
module.exports = {
  async 'read-all'() {
    return (await cities.read()).rows
  }
}
