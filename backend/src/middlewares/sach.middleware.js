function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function validateSachFields(req, res, next, includeMaSach) {
  const {
    MaSach,
    TenSach,
    DonGia,
    SoQuyen,
    NamXuatBan,
    MaNXB,
    NguonGocTacGia,
  } = req.body;

  const cacTruongKiemTra = [TenSach, MaNXB, NguonGocTacGia];

  if (includeMaSach) {
    cacTruongKiemTra.push(MaSach);
  }

  const cacTruongHopLe = cacTruongKiemTra.every(isNonEmptyString);

  if (!cacTruongHopLe) {
    return res.status(400).json({
      message: includeMaSach
        ? "MaSach, TenSach, MaNXB và NguonGocTacGia đều phải là chuỗi không rỗng"
        : "TenSach, MaNXB và NguonGocTacGia đều phải là chuỗi không rỗng",
    });
  }

  if (typeof DonGia !== "number" || !Number.isFinite(DonGia) || DonGia < 0) {
    return res.status(400).json({
      message: "DonGia phải là một số không âm",
    });
  }

  if (!Number.isInteger(SoQuyen) || SoQuyen < 0) {
    return res.status(400).json({
      message: "SoQuyen phải là một số nguyên không âm",
    });
  }

  if (
    !Number.isInteger(NamXuatBan) ||
    NamXuatBan < 1000 ||
    NamXuatBan > new Date().getFullYear()
  ) {
    return res.status(400).json({
      message:
        "NamXuatBan phải là số nguyên và không được lớn hơn năm hiện tại",
    });
  }

  req.validatedData = {
    TenSach: TenSach.trim(),
    DonGia,
    SoQuyen,
    NamXuatBan,
    MaNXB: MaNXB.trim(),
    NguonGocTacGia: NguonGocTacGia.trim(),
  };

  if (includeMaSach) {
    req.validatedData.MaSach = MaSach.trim();
  }

  next();
}

export function validateCreateSach(req, res, next) {
  return validateSachFields(req, res, next, true);
}

export function validateUpdateSach(req, res, next) {
  return validateSachFields(req, res, next, false);
}

export async function validateMaSachParam(req, res, next) {
  const { maSach } = req.params;

  if (!isNonEmptyString(maSach)) {
    return res.status(400).json({
      message: "Mã sách không hợp lệ",
    });
  }

  req.validatedParams = {
    maSach: maSach.trim(),
  };

  next();
}
