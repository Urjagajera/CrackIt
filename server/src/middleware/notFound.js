/**
 * Wraps a 404 into our standard error shape so the centralized
 * error handler can catch it.
 */
export function notFoundHandler(_req, _res, next) {
  const err = new Error("Route not found");
  err.statusCode = 404;
  err.code = "NOT_FOUND";
  next(err);
}
