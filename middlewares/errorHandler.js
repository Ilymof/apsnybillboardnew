const errorHandler = (res, error) => {
    console.error(error);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  };
  
  module.exports = errorHandler;