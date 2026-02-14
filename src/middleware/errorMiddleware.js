const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";


  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }

  
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;
