const deleteAnyListing = require('../use-cases/admin/deleteAnyListing.useCase')
const banUser = require('../use-cases/admin/banUser.useCase')

module.exports = {
   async deleteListing(queryParams, accessToken) {
      return await deleteAnyListing(queryParams, accessToken)
   },
   async ban(userId, accessToken) {
      return await banUser(userId, accessToken)
   }
}