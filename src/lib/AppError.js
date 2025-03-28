class AppError extends Error {
   constructor({ type, message, detail, status = 500, toClient = true, toLogs = true }) {
      super(message)
      this.type = type
      this.message = message
      this.detail = detail
      this.status = status
      this.toClient = toClient
      this.toLogs = toLogs
   }
}

module.exports = AppError