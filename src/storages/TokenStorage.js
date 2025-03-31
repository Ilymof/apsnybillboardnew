'use strict'
const db = require('../db')
const token = db('tokens')

module.exports = {
   async setToken(userId,userIp, refreshToken) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 14)
      const sql = `
    INSERT INTO tokens (user_id, token, expires_at, ip)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, ip) DO UPDATE
        SET 
            token = EXCLUDED.token,
            expires_at = EXCLUDED.expires_at
        RETURNING *;`
      const values = [userId, refreshToken, expiresAt, userIp]
      return (await token.query(sql, values)).rows
   },
   async getToken(userId, userIp) {
      const sql = `
         SELECT token 
         FROM tokens 
         WHERE user_id = $1 AND expires_at > NOW() AND ip = $2;
      `
      const values = [userId, userIp]
      const result = await token.query(sql, values)
      return result.rows.length > 0 ? result.rows[0].token : null
   },
   async deleteToken(userId, userIp) {
      const sql = 'DELETE FROM tokens WHERE user_id = $1 AND ip = $2;'
      const values = [userId, userIp]
      return await token.query(sql, values)
   }
}