import { isNonEmptyString } from "../utils/validation.js";

export function validateCreateNhaXuatBan(req, res, next) {
  const { MaNXB, TenNXB, DiaChi } = req.body;

  const cacTruongHopLe = [MaNXB, TenNXB, DiaChi].every(isNonEmptyString);

  if (!cacTruongHopLe) {
    return res.status(400).json({
      message: "MaNXB, TenNXB và DiaChi đều phải là chuỗi không rỗng",
    });
  }

  req.validatedData = {
    MaNXB: MaNXB.trim(),
    TenNXB: TenNXB.trim(),
    DiaChi: DiaChi.trim(),
  };

  next();
}

export function validateUpdateNhaXuatBan(req, res, next) {
  const { TenNXB, DiaChi } = req.body;

  const cacTruongHopLe = [TenNXB, DiaChi].every(isNonEmptyString);

  if (!cacTruongHopLe) {
    return res.status(400).json({
      message: "TenNXB và DiaChi đều phải là chuỗi không rỗng",
    });
  }

  req.validatedData = {
    TenNXB: TenNXB.trim(),
    DiaChi: DiaChi.trim(),
  };

  next();
}

export function validateMaNXBParam(req, res, next) {
  const { maNXB } = req.params;

  if (!isNonEmptyString(maNXB)) {
    return res.status(400).json({
      message: "Mã nhà xuất bản không hợp lệ",
    });
  }

  req.validatedParams = {
    maNXB: maNXB.trim(),
  };

  next();
}
