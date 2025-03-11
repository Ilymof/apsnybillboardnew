'use strict'

function transformToCategoryStructure(rows) {
   return rows.reduce((acc, row) => {
      const categoryIndex = acc.findIndex(cat => cat.id === row.category_id)

      if (categoryIndex === -1) {
         return [
            ...acc,
            {
               id: row.category_id,
               categoryName: row.category_name,
               path: row.category_path,
               image: row.category_image,
               subcategories: row.subcategory_id
                  ? [{
                     id: row.subcategory_id,
                     subcategoryName: row.subcategory_name,
                     path: row.subcategory_path
                  }]
                  : []
            }
         ]
      } else {
         const existingCategory = acc[categoryIndex]
         const updatedCategory = {
            ...existingCategory,
            subcategories: row.subcategory_id
               ? [
                  ...existingCategory.subcategories,
                  {
                     id: row.subcategory_id,
                     subcategoryName: row.subcategory_name,
                     path: row.subcategory_path
                  }
               ]
               : existingCategory.subcategories
         }

         return [
            ...acc.slice(0, categoryIndex),
            updatedCategory,
            ...acc.slice(categoryIndex + 1)
         ]
      }
   }, [])
}
module.exports = transformToCategoryStructure