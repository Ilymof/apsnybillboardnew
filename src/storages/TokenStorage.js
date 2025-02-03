'use strict'
const db = require('../db')
const token = db('tokens')

module.exports = {
  async setToken(userId, refreshToken) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 2)
    const sql = `
    INSERT INTO 
    tokens (user_id, token, expires_at) 
    VALUES ($1, $2, $3) 
    RETURNING *;`;
    const values = [userId, refreshToken, expiresAt]
    return (await token.query(sql, values)).rows
  },
  async deleteToken(userId) {
    const sql = `DELETE FROM tokens WHERE user_id = $1;`
    const values = [userId]
    return await token.query(sql, values)
  }
}