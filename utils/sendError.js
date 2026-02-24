export const sendError = (next, statusCode, message) => {
  return next({
    statusCode,
    message,
  });
};
