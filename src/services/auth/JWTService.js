'use strict'

const jwt = require('jsonwebtoken')
const { JWT } = require('../../config')

const TokenService = {
   generateTokens(payload) {
      const accessToken = jwt.sign(payload, JWT.accessSecret, {
         expiresIn: JWT.accessExpiresIn
      })

      const refreshToken = jwt.sign(payload, JWT.refreshSecret, {
         expiresIn: JWT.refreshExpiresIn
      })

      return { accessToken, refreshToken }
   },

   async verifyAccessToken(token) {
      await jwt.verify(token, JWT.accessSecret, (err) => {
         console.dir(err.message)
      })
   },

   verifyRefreshToken(token) {
      try {
         return jwt.verify(token, JWT.refreshSecret)
      } catch {
         return null
      }
   }
}

module.exports = TokenService