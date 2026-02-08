exports.successResponse = ({
  res,
  responseCode = 200,
  responseMessage = "Success",
  responseObject = null,
  pageSize = null
}) => {
  return res.status(responseCode).json({
    responseCode,
    responseMessage,
    responseObject,
    pageSize
  });
};

exports.errorResponse = ({
  res,
  responseCode = 500,
  responseMessage = "Internal Server Error"
}) => {
  return res.status(responseCode).json({
    responseCode,
    responseMessage,
    responseObject: null,
    pageSize: null
  });
};
