'use strict'

const ListingStorage = require('../../storages/ListingStorage')
const getListings = require('../listing/readListings.useCase')
const { promises: fs } = require('fs')
const path = require('path')

const checkExpiredListings = async () => {
   try {
      const result = await getListings({})
      const listings = result.listings || []
      const now = new Date()

      for (const listing of listings) {
         const { id, updated_at, expiration_days, images, author } = listing
         const createdDate = new Date(updated_at)
         const expiresAt = new Date(createdDate.getTime() + expiration_days * 24 * 60 * 60 * 1000)

         if (now >= expiresAt) {
            if (images && images.length > 0) {
               for (const image of images) {
                  const filePath = path.join('/uploads', image)
                  console.log(`Deleting file: ${filePath}`)
                  try {
                     await fs.access(filePath)
                     await fs.unlink(filePath)
                  } catch (err) {
                     console.log(`File not found or error deleting: ${filePath}`, err.message)
                  }
               }
            }
            await ListingStorage.delete(id, author.id)
            console.log(`Listing ${id} expired and deleted`)
         }
      }
   } catch (error) {
      console.error('Error in auto-delete:', error)
   }
}

setInterval(checkExpiredListings, 24 * 60 * 60 * 1000)

checkExpiredListings()

module.exports = { checkExpiredListings }