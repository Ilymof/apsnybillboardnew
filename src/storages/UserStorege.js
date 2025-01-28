'use strict'

const db = require('../db.js')
const category = db('users')
const TE = require('../lib/taskEither')
const E = require('../lib/either')
module.exports = {
  getUserByProviderAndId(provider, id) {
    const sql = `
      SELEC T *
      FROM users
      WHERE provider_user_id = $1 AND auth_provider = $2;
    `;
    const values = [id, provider];
    return TE(async () => {
      try {
        const result = await category.query(sql, values);
        return E.Right(result.rows);
      } catch (error) {
        return E.Left('Ошибка при выполнении запроса');
      }
    });
  }
}