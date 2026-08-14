import jwt from "jsonwebtoken";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

export function validateLogin(req, res, next) {
  const { MSNV, Password } = req.body;

  if (!isNonEmptyString(MSNV) || !isNonEmptyString(Password)) {
    return res.status(400).json({
      message: "MSNV và Password đều phải là chuỗi không rỗng",
    });
  }

  req.validatedData = {
    MSNV: MSNV.trim(),
    Password: Password.trim(),
  };

  next();
}

export function authenticateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      message: "Bạn chưa cấp token xác thực",
    });
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Authorization header phải có dạng Bearer <token>",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return next(new Error("Thiếu biến môi trường JWT_SECRET"));
  }

  try {
    const payload = jwt.verify(token, jwtSecret);

    req.auth = {
      MSNV: payload.MSNV,
      ChucVu: payload.ChucVu,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token đã hết hạn",
      });
    }

    return res.status(401).json({
      message: "Token không hợp lệ",
    });
  }
}
