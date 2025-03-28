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
         expiration_days: data.expiration_days,
         city: data.city,
         city_id: data.city_id,
         author: {
            id: data.author_id,
            name: data.author_name,
            authors_phone: data.author_phone,
            authors_telegram: data.author_telegram,
            authors_whatsapp: data.author_whatsapp
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
         },
         contacts:{
            telegram: data.telegram,
            whatsapp: data.whatsapp,
            phone: data.phone
         }
      }))
   }
}