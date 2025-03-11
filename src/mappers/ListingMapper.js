'use strict'

module.exports = {
   transformListings(dataArray) {
      return dataArray.map(data => ({
         id: data.listing_id,
         title: data.title,
         description: data.description,
         price: data.price,
         images: data.images,
         created_at: data.created_at,
         updated_at: data.updated_at,
         author: {
            id: data.author_id,
            name: data.author_name,
            phone: data.author_phone,
            telegram: data.author_telegram,
            whatsapp: data.author_whatsapp
         },
         category: {
            id: data.category_id,
            name: data.category_name,
            path: data.category_path,
            image: data.category_image
         },
         subcategory: {
            id: data.subcategory_id,
            name: data.subcategory_name,
            path: data.subcategory_path
         }
      }))
   }
}