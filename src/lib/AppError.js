class AppError {
  constructor({ type, message, detail, toClient = true, toLogs = true }) {
    this.message = message;
    this.type = type;
    this.detail = detail;
    this.toClient = toClient;
    this.toLogs = toLogs;
  }
}
module.exports = AppError;
