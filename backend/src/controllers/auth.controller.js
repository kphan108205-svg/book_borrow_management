import { loginNhanVien } from "../services/auth.service.js";
import { findNhanVienByMSNV } from "../services/nhan-vien.service.js";

export async function login(req, res, next) {
  try {
    const loginData = req.validatedData;

    const result = await loginNhanVien(loginData);

    if (result.status === "invalid_credentials") {
      return res.status(401).json({
        message: "MSNV hoặc mật khẩu không chính xác",
      });
    }

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentNhanVien(req, res, next) {
  try {
    const nhanVien = await findNhanVienByMSNV(req.auth.MSNV);

    if (!nhanVien) {
      return res.status(401).json({
        message: "Tài khoản trong token không tồn tại",
      });
    }

    return res.status(200).json(nhanVien);
  } catch (error) {
    next(error);
  }
}
