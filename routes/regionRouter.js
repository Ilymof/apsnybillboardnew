const regionController = require('../controllers/regionController');

const regionRouter = async (req, res) => {
  if (req.method === 'POST' && req.url === '/regions') {
    return regionController.createRegion(req, res);
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Ресурс не найден' }));
};

module.exports = regionRouter;