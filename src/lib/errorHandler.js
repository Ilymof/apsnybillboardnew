const AppError = require('./AppError')

const errorHandler = (error) => {
  console.log('fasdfasd', error)
  console.log(error instanceof AppError);

  if (!(error instanceof AppError)) {
    error = new AppError({
      type: 'server',
      message: 'Внутренняя ошибка сервера',
      detail: error.message,
      toClient: true,
      toLogs: true
    });
  }

  if (error.toLogs) {
    console.error(`[${error.type.toUpperCase()}]: ${error.detail}`);
  }

  return error.toClient
    ? {
      message: error.message,
      type: error.type,
      detail: error.detail
    }
    : { message: 'Что-то пошло не так' };
};
module.exports = errorHandler