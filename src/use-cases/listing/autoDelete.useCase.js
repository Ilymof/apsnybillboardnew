'use strict'

const ListingStorage = require('../../storages/ListingStorage')
const getListings = require('../listing/readListings.useCase')
const fs = require('fs')
const path = require('path')


const checkExpiredListings = async () => {
   try {
      const listings = await getListings({})
      const now = new Date()

      for (const listing of listings) {
         const { id, created_at, expiration_days, images, author } = listing
         const createdDate = new Date(created_at)
         const expiresAt = new Date(createdDate.getTime() + expiration_days * 24 * 60 * 60 * 1000)    

         if (now >= expiresAt) {
            if (images && images.length > 0) {
               for (const image of images) {
                  const filePath = path.join(__dirname, '../../uploads', image)
                  console.log(`Deleting file: ${filePath}`)
                  if (fs.existsSync(filePath)) {
                     fs.unlinkSync(filePath)
                  } else {
                     console.log(`File not found: ${filePath}`)
                  }
               }
            }
            await ListingStorage.delete(id, author.id)
            console.log(`Listing ${id} expired and deleted`)
         } else {
            console.log(`Listing ${id} not yet expired`)
         }
      }
   } catch (error) {
      console.error('Error in auto-delete:', error)
   }
}

setInterval(checkExpiredListings, 24 * 60 * 60 * 1000)

checkExpiredListings()

module.exports = { checkExpiredListings }