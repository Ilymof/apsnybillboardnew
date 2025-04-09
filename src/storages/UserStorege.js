/* eslint-disable indent */
'use strict'
const db = require('../db')
const user = db('users')

module.exports = {
    async getUserByProviderAndId(id) {
        const sql = `
            SELECT * FROM users
            WHERE provider_user_id = $1
        `
        const values = [id]
        return (await user.query(sql, values)).rows[0]
    },

    async insertOrUpdateUser(data) {
        const sql = `
            INSERT INTO users (
                full_name, 
                role, 
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
            ON CONFLICT (provider_user_id) DO UPDATE 
            SET 
                full_name = EXCLUDED.full_name,
                ip = EXCLUDED.ip,
                useragent = EXCLUDED.useragent,
                telegram = EXCLUDED.telegram,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `

        const values = [
			`${data.user.first_name} ${data.user.last_name || ''}`.trim(), // Полное имя
			data.role || 0, // Роль по умолчанию 0, если не указана
			data.ip,
			data.useragent,
			data.auth_provider,
			data.user.id.toString(), // Преобразуем id в строку
			data.user.username || null // telegram = username
        ]

        try {
            const result = await user.query(sql, values)
            return result.rows[0]
        } catch (error) {
            console.error('Ошибка в insertOrUpdateUser:', error)
            throw error // Передаем ошибку выше для обработки
        }
    }
}