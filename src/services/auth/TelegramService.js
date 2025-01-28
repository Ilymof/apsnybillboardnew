const crypto = require('crypto');
const E = require('../../lib/either.js');

/**
 * Функция для проверки хеша Telegram-данных
 * @param {Object} data - объект с данными
 * @returns {Either} - Left с ошибкой или Right с объектом данных
 */
const verifyTelegramHash = (data) => {
  const { user } = data;
  const secretKey = process.env.TG_BOT_TOKEN
  const sortedData = Object.entries(user)
    .filter(([key]) => key !== 'hash')
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');

  const secretKeyHash = crypto.createHash('sha256').update(secretKey).digest();
  const hash = crypto
    .createHmac('sha256', secretKeyHash)
    .update(sortedData)
    .digest('hex');

  if (hash === user.hash) {
    return E.Right(data);
  } else {
    return E.Left('Hash mismatch');
  }
};

module.exports = { verifyTelegramHash };
