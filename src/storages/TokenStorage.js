'use strict'
const db = require('../db')
const token = db('tokens')

module.exports = {
   async setToken(userId, userIp, user_agent, refreshToken) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 14)
      const sql = `
    INSERT INTO tokens (user_id, token, ip, user_agent, expires_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`
      const values = [userId, refreshToken, userIp, user_agent, expiresAt]
      return (await token.query(sql, values)).rows
   },
   
   async getToken(userId, refreshToken) {
      const sql = `
         SELECT token 
         FROM tokens 
         WHERE user_id = $1 AND expires_at > NOW() AND token = $2;
      `
      const values = [userId, refreshToken]
      const result = await token.query(sql, values)
      return result.rows.length > 0 ? result.rows[0].token : null
   },
   async deleteToken(userId, refreshToken) {
      const sql = 'DELETE FROM tokens WHERE user_id = $1 AND token = $2;'
      const values = [userId, refreshToken]
      return await token.query(sql, values)
   }
}