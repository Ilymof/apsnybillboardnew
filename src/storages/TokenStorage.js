'use strict'
const db = require('../db')
const token = db('tokens')

module.exports = {
   async setToken(userId, refreshToken) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 14)
      const sql = `
    INSERT INTO 
    tokens (user_id, token, expires_at) 
    VALUES ($1, $2, $3) 
    RETURNING *;`
      const values = [userId, refreshToken, expiresAt]
      return (await token.query(sql, values)).rows
   },
   async getToken(userId) {
      const sql = `
         SELECT token 
         FROM tokens 
         WHERE user_id = $1 AND expires_at > NOW();
      `
      const values = [userId]
      const result = await token.query(sql, values)
      return result.rows.length > 0 ? result.rows[0].token : null
   },
   async deleteToken(userId) {
      const sql = 'DELETE FROM tokens WHERE user_id = $1;'
      const values = [userId]
      return await token.query(sql, values)
   }
}