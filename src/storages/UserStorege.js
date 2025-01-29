'use strict'

const db = require('../db.js')
const user = db('users')
const TE = require('fp-ts/lib/TaskEither')
module.exports = {
	getUserByProviderAndId(provider, id) {
		const sql = `
      SELECT * FROM users
      WHERE provider_user_id = $1 AND auth_provider = $2;
    `;
		const values = [id, provider];

		return TE.tryCatch(
			async () => {
				const result = await user.query(sql, values);
				return result.rows.length > 0 ? result.rows[0] : null;
			},
			(error) => `Ошибка при выполнении запроса: ${String(error)}`
		);
	},

	insertOrUpdateUser(data) {
		const sql = `
		  INSERT INTO users (
			 full_name, 
			 role_id, 
			 ip, 
			 useragent, 
			 auth_provider, 
			 provider_user_id, 
			 telegram, 
			 created_at, 
			 updated_at
		  ) 
		  VALUES (
			 $1, 
			 COALESCE($2, 1), 
			 $3, 
			 $4, 
			 $5, 
			 $6, 
			 $7, 
			 CURRENT_TIMESTAMP, 
			 CURRENT_TIMESTAMP
		  )
		  ON CONFLICT (provider_user_id, auth_provider) DO UPDATE 
		  SET 
			 full_name = EXCLUDED.full_name,
			 ip = EXCLUDED.ip,
			 useragent = EXCLUDED.useragent,
			 telegram = EXCLUDED.telegram,
			 updated_at = CURRENT_TIMESTAMP
		  RETURNING *;
		`;

		const values = [
			`${data.user.first_name} ${data.user.last_name || ''}`.trim(),
			1, // Значение role_id по умолчанию
			data.ip,
			data.useragent,
			data.auth_provider,
			data.user.id.toString(),
			data.user.username || null,
		];

		return TE.tryCatch(
			async () => (await user.query(sql, values)).rows,
			() => 'Ошибка вставки/обновления пользователя'
		);
	}
}