function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

export function validateNhanVienFields(req, res, next, includeAccountFields) {
  const { MSNV, HoTenNV, Password, ChucVu, DiaChi, SoDienThoai } = req.body;

  const cacTruongKiemTra = [HoTenNV, ChucVu, DiaChi, SoDienThoai];

  if (includeAccountFields) {
    cacTruongKiemTra.push(MSNV, Password);
  }

  const cacTruongHopLe = cacTruongKiemTra.every(isNonEmptyString);

  if (!cacTruongHopLe) {
    return res.status(400).json({
      message: includeAccountFields
        ? "MSNV, HoTenNV, Password, ChucVu, DiaChi và SoDienThoai đều phải là chuỗi không rỗng"
        : "HoTenNV, ChucVu, DiaChi và SoDienThoai đều phải là chuỗi không rỗng",
    });
  }

  const soDienThoai = SoDienThoai.trim();

  if (!/^[0-9]{10,11}$/.test(soDienThoai)) {
    return res.status(400).json({
      message: "SoDienThoai phải gồm từ 10 đến 11 chữ số",
    });
  }

  req.validatedData = {
    HoTenNV: HoTenNV.trim(),
    ChucVu: ChucVu.trim(),
    DiaChi: DiaChi.trim(),
    SoDienThoai: soDienThoai,
  };

  if (includeAccountFields) {
    const password = Password.trim();

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password phải có ít nhất 8 ký tự",
      });
    }

    req.validatedData.MSNV = MSNV.trim();
    req.validatedData.Password = password;
  }

  next();
}

export function validateCreateNhanVien(req, res, next) {
  return validateNhanVienFields(req, res, next, true);
}

export function validateUpdateNhanVien(req, res, next) {
  return validateNhanVienFields(req, res, next, false);
}

export function validateMSNVParam(req, res, next) {
  const { msnv } = req.params;

  if (!isNonEmptyString(msnv)) {
    return res.status(400).json({
      message: "Mã số nhân viên không hợp lệ",
    });
  }

  req.validatedParams = {
    msnv: msnv.trim(),
  };

  next();
}

export function validateChangePassword(req, res, next) {
  const { CurrentPassword, NewPassword } = req.body;

  if (!isNonEmptyString(CurrentPassword) || !isNonEmptyString(NewPassword)) {
    return res.status(400).json({
      message: "Mật khẩu mới và mật khẩu cũ đều phải là chuỗi không rỗng",
    });
  }

  const currentPassword = CurrentPassword.trim();
  const newPassword = NewPassword.trim();

  if (newPassword.length < 8) {
    return res.status(400).json({
      message: "Password phải có ít nhất 8 ký tự",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      message: "Mật khẩu mới phải khác mật khẩu hiện tại",
    });
  }

  req.validatedData = {
    CurrentPassword: currentPassword,
    NewPassword: newPassword,
  };

  next();
}
