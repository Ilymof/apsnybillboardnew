const http = require('http');
const pool = require('./config/database');
const { createTables } = require('./models/index');
require('dotenv').config();
const routes = require('./routes/routes');

const PORT = process.env.PORT || 3000;

// Проверка подключения к базе данных
const checkDatabaseConnection = async () => {
    try {
        await pool.query('SELECT 1'); // Тестовый запрос
        console.log('Успешное подключение к базе данных');
    } catch (error) {
        console.error('Ошибка подключения к базе данных:', error.message);
        process.exit(1); // Завершение процесса при ошибке
    }
};

// Создание таблиц в базе данных
const initializeDatabase = async () => {
    try {
        await createTables(); // Вызов функции для создания таблиц
        console.log('Все таблицы успешно созданы');
    } catch (error) {
        console.error('Ошибка создания таблиц:', error.message);
        process.exit(1);
    }
};

// Обработка завершения приложения
const gracefulShutdown = async () => {
    console.log('Получен сигнал завершения. Завершаем сервер...');
    try {
        await pool.end(); // Завершение пула соединений
        console.log('Пул соединений с базой данных завершён');
        process.exit(0); // Корректное завершение
    } catch (error) {
        console.error('Ошибка при завершении пула:', error.message);
        process.exit(1); // Завершение с ошибкой
    }
};

// Обработка сигналов завершения
process.on('SIGINT', gracefulShutdown); // При нажатии Ctrl + C
process.on('SIGTERM', gracefulShutdown); // При завершении через системный сигнал

// Запуск сервера
const startServer = async () => {
    await checkDatabaseConnection(); // Проверка БД
    await initializeDatabase(); // Создание таблиц

    // Создание HTTP-сервера
    const server = http.createServer(async (req, res) => {
        try {
            await routes(req, res);
        } catch (error) {
            console.error('Ошибка сервера:', error);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Внутренняя ошибка сервера' }));
            }
        }
    });

    server.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
    });
};

// Запуск сервера
startServer();
