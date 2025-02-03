'use strict'

const jwt = require('jsonwebtoken')
const { JWT } = require('../../config')

const TokenService = {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, JWT.accessSecret, {
      expiresIn: JWT.accessExpiresIn,
    })

    const refreshToken = jwt.sign(payload, JWT.refreshSecret, {
      expiresIn: JWT.refreshExpiresIn,
    })

    return { accessToken, refreshToken };
  },

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, JWT.accessSecret);
    } catch (error) {
      return null;
    }
  },

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, JWT.refreshSecret);
    } catch (error) {
      return null;
    }
  }
}

module.exports = TokenService