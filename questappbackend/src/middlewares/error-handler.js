const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  console.log(err.message);

  return res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
