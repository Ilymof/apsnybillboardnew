'use strict'


const JWT = {
  accessSecret: process.env.ACCESS_TOKEN_SECRET || "supersecret",
  refreshSecret: process.env.REFRESH_TOKEN_SECRET || "supersecret_refresh",
  accessExpiresIn: "15m",
  refreshExpiresIn: "2d",
}

module.exports = { JWT }
