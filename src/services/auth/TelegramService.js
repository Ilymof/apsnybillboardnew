const crypto = require('crypto');


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
    return true
  } else {
    return false
  }
};

module.exports = { verifyTelegramHash };
