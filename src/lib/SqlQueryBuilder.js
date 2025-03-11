'use strict'

class SqlQueryBuilder {
   constructor(baseSql) {
      this.sql = baseSql
      this.values = []
      this.hasWhere = false
      this.hasOrder = false
   }

   createWhere(conditions, params) {
      const activeConditions = conditions.map((fn) => fn(params)).filter(Boolean)

      if (activeConditions.length) {
         this.sql += ` WHERE ${activeConditions.map((_, i) => _.sql.replace('?', `$${this.values.length + i + 1}`)).join(' AND ')}`
         this.values.push(...activeConditions.map((c) => c.value))
         this.hasWhere = true
      }

      return this
   }

   createOrder(column = 'l.created_at', direction = 'DESC') {
      if (!this.hasOrder) {
         this.sql += ` ORDER BY ${column} ${direction}`
         this.hasOrder = true
      }
      return this
   }

   createPagination({ limit = 10, page = 1 }) {
      const parsedLimit = parseInt(limit, 10) || 10
      const parsedPage = Math.max(parseInt(page, 10) || 1, 1)
      const offset = (parsedPage - 1) * parsedLimit

      this.sql += ` LIMIT $${this.values.length + 1} OFFSET $${this.values.length + 2}`
      this.values.push(parsedLimit, offset)

      return this
   }

   end() {
      this.sql += ';'
      return { sql: this.sql, values: this.values }
   }
}

module.exports = SqlQueryBuilder
