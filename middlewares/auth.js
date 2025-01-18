const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/cfg')

const auth = (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: 'Unauthorized' }));
    return false;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; 
    return true;
  } catch (err) {
    res.statusCode = 403;
    res.end(JSON.stringify({ message: 'Forbidden' }));
    return false;
  }
};

module.exports = auth;