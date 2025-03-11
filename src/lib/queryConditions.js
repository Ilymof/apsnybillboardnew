/**
 * Создаёт объект SQL-условия для безопасной подстановки параметров.
 *
 * @param {string} column - Название столбца в базе данных (например, "users.id").
 * @param {string} operator - Оператор сравнения (например, '=', '>', '<', 'ILIKE').
 * @param {string | number} value - Значение для сравнения.
 * @param {boolean} [isLike=false] - Если `true`, значение оборачивается в `%` (используется для `ILIKE` / `LIKE`).
 * @returns {{ sql: string, value: string | number }} Объект с SQL-условием (`sql`) и значением (`value`).
 *
 * @example
 * createCondition('users.name', 'ILIKE', 'John', true)
 * // Вернёт:
 * // {
 * //   sql: 'users.name ILIKE ?',
 * //   value: '%John%'
 * // }
 *
 * @example
 * createCondition('users.age', '>=', 18)
 * // Вернёт:
 * // {
 * //   sql: 'users.age >= ?',
 * //   value: 18
 * // }
 */
const createCondition = (column, operator, value, isLike = false) => ({
   sql: `${column} ${operator} ?`,
   value: isLike ? `%${value}%` : value
})

module.exports = { createCondition }
