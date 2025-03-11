'use strict'

const { loginUser } = require('../use-cases/user/auth/loginUser.useCase')

module.exports = {
   async login(userData) {
      return await loginUser(userData)
   }
}

