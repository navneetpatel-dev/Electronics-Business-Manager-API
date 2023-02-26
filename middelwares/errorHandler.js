const pageNotFound = (req, res, next) => {
  res.status(404);
  next(new Error("Page Not Found"));
};

const errorHandler = (err, req, res, next) => {
  const errStatus = res.statusCode === 200 ? 500 : res.statusCode;
  const errMsg = err.message || "Server Error";
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

module.exports = { errorHandler, pageNotFound };
