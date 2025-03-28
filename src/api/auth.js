'use strict'
const {loginUser, toRefreshToken, logoutUser, check } = require('../use-cases/user/auth/loginUser.useCase.js')



module.exports = {
   async login(userData) {
      return await loginUser(userData)
   },
   async refresh(refreshToken) {
      return await toRefreshToken(refreshToken)
   },
   async logout(refreshToken) {
      return await logoutUser(refreshToken)
   },
   async 'token-check'(queryParams,accessToken)
   {
      return await check(queryParams,accessToken)
   }
}