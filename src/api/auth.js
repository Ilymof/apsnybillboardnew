'use strict'

const { loginUser } = require('../use-cases/user/auth/loginUser.useCase.js')
const { toRefreshToken } = require('../use-cases/user/auth/loginUser.useCase.js')
const { logoutUser } = require('../use-cases/user/auth/loginUser.useCase.js')

module.exports = {
   async login(userData) {
      return await loginUser(userData)
   },
   async refresh(refreshToken) {
      return await toRefreshToken(refreshToken)
   },
   async logout(refreshToken) {
      return await logoutUser(refreshToken)
   }
}