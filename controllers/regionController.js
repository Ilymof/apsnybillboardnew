const regionServices = require('../services/regionServices'); // Подключаем сервисы
const parseBody = require('../utils/parseBody')


  async function createRegion(req, res) {
    try {
      const body = await parseBody(req); // Парсим тело запроса
      const { regionName } = body;

      if (!regionName) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Поле regionName обязательно' }));
      }

      // Логика для добавления региона
      const newRegion = await regionServices.createRegion(regionName);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newRegion));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Ошибка при добавлении региона', error: error.message }));
    }
  }


module.exports = {
  createRegion
};