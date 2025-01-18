const regionRouter = require('./regionRouter');

const routes = async (req, res) => {
  // Роутинг для региона
  if (req.url.startsWith('/regions')) {
    return regionRouter(req, res);
  }

  // Если маршрут не найден
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Ресурс не найден' }));
};

module.exports = routes;