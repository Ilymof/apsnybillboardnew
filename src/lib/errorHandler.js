const AppError = require('./AppError')

const errorHandler = (error) => {
   // Логируем исходную ошибку для отладки
   console.log('Original error:', error)

   // Если ошибка не является AppError, преобразуем её
   if (!(error instanceof AppError)) {
      error = new AppError({
         type: 'server',
         message: 'Внутренняя ошибка сервера',
         detail: error.message || 'Unknown error',
         status: 500, // По умолчанию 500 для серверных ошибок
         toClient: true,
         toLogs: true
      })
   }

   // Логируем в консоль, если указано
   if (error.toLogs) {
      console.error(`[${error.type.toUpperCase()}]: ${error.message} - ${error.detail}`)
   }

   // Формируем ответ для клиента
   const clientResponse = {
      message: error.message,
      type: error.type,
      status: error.status || 500 // Указываем HTTP-статус
   }

   // Добавляем detail только если toClient === true и detail существует
   if (error.toClient && error.detail) {
      clientResponse.detail = error.detail
   }

   return clientResponse
}

module.exports = errorHandler