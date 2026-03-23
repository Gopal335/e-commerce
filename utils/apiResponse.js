export const successResponse = (statusCode, res, message, result) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: result,
  });
};