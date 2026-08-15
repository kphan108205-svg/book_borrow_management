export function requireRole(...allowedRoles) {
  return function roleAuthorizationMiddleware(req, res, next) {
    if (!req.auth) {
      return res.status(401).json({
        messsage: "Bạn chưa được xác thực",
      });
    }

    if (!allowedRoles.includes(req.auth.ChucVu)) {
      return res.status(403).json({
        messsage: "Bạn không có quyền thực hiện chức năng này",
      });
    }

    next();
  };
}

export function requireSelf(req, res, next) {
  if (!req.auth) {
    return res.status(401).json({
      messsage: "Bạn chưa được xác thực",
    });
  }

  const { msnv } = req.validatedParams;

  if (req.auth.MSNV !== msnv) {
    return res.status(403).json({
      messsage: "Bạn chỉ có thể thực hiện thao tác này với tài khoản của mình",
    });
  }

  next();
}
