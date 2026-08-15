export function notFoundHandler(req, res) {
  return res.status(404).json({
    message: `Không tìm thấy API ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const isInvalidJson =
    error instanceof SyntaxError && error.status === 400 && "body" in error;

  if (isInvalidJson) {
    return res.status(400).json({
      message: "Dữ liệu JSON không đúng cú pháp",
    });
  }

  if (error.code === 11000) {
    const duplicateFields = Object.keys(error.keyValue ?? {});

    return res.status(409).json({
      message:
        duplicateFields.length > 0
          ? `Dữ liệu bị trùng tại trường: ${duplicateFields.join(", ")}`
          : `Dữ liệu bị trùng với bản ghi đã tồn tại`,
    });
  }

  return res.status(500).json({
    message: "Đã xảy ra lỗi trên máy chủ",
  });
}
