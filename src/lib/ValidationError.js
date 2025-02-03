const AppError = require("./AppError");

class ValidationError extends AppError {
  constructor(detail) {
    super({
      type: "validation",
      message: "Неверные входные данные",
      detail,
      toClient: true,
      toLogs: false,
    });
  }
}
module.exports = ValidationError;
