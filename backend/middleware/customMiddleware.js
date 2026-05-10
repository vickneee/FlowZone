const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, _next) => {
  console.error("ERROR:", error);
  
  response.status(response.statusCode === 200 ? 500 : response.statusCode);
  
  response.json({
    error: error.message || "Server Error",
  });
};

const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
