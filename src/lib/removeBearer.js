const removeBearer = (token) => {
   if (!token) return null
   return token.replace(/^Bearer\s+/i, '')
}

module.exports = removeBearer 
