'use strict'
const process = require('node:process')


const JWT = {
   accessSecret: process.env.ACCESS_TOKEN_SECRET || 'supersecret',
   refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'supersecret_refresh',
   accessExpiresIn: '15m',
   refreshExpiresIn: '14d'
}

module.exports = { JWT }
