import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getDatabase } from "../configs/database.js";

export async function loginNhanVien(loginData) {
  const database = getDatabase();
  const nhanVienCollection = database.collection("NhanVien");

  const nhanVien = await nhanVienCollection.findOne({ MSNV: loginData.MSNV });

  if (!nhanVien) {
    return {
      status: "invalid_credentials",
    };
  }

  const passwordIsCorrect = await bcrypt.compare(
    loginData.Password,
    nhanVien.PasswordHash,
  );

  if (!passwordIsCorrect) {
    return {
      status: "invalid_credentials",
    };
  }

  const jwtSecret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "8h";

  if (!jwtSecret) {
    throw new Error("Thiếu biến môi trường JWT_SECRET");
  }

  const token = jwt.sign(
    {
      MSNV: nhanVien.MSNV,
      ChucVu: nhanVien.ChucVu,
    },
    jwtSecret,
    {
      expiresIn,
    },
  );

  return {
    status: "authenticated",
    data: {
      token,
      nhanVien: {
        _id: nhanVien._id,
        MSNV: nhanVien.MSNV,
        HoTenNV: nhanVien.HoTenNV,
        ChucVu: nhanVien.ChucVu,
        DiaChi: nhanVien.DiaChi,
        SoDienThoai: nhanVien.SoDienThoai,
      },
    },
  };
}
