import { isNonEmptyString, parseDateOnly } from "../utils/validation.js";

export async function validateDocGiaFields(req, res, next, includeMaDocGia) {
  const { MaDocGia, HoLot, Ten, NgaySinh, Phai, DiaChi, DienThoai } = req.body;

  const cacTruongKiemTra = [HoLot, Ten, Phai, DiaChi, DienThoai];

  if (includeMaDocGia) {
    cacTruongKiemTra.push(MaDocGia);
  }

  const cacTruongHopLe = cacTruongKiemTra.every(isNonEmptyString);

  if (!cacTruongHopLe) {
    return res.status(400).json({
      message: includeMaSach
        ? "MaDocGia, HoLot, Ten, Phai, DiaChi và DienThoai đều phải là chuỗi không rỗng"
        : "HoLot, Ten, Phai, DiaChi và DienThoai đều phải là chuỗi không rỗng",
    });
  }

  const ngaySinh = parseDateOnly(NgaySinh);

  if (!ngaySinh) {
    return res.status(400).json({
      message: "Ngày sinh phải là ngày hợp lệ theo định dạng YYYY-MM-DD",
    });
  }

  const homNay = new Date();
  const homNayUTC = new Date(
    Date.UTC(homNay.getFullYear(), homNay.getMonth(), homNay.getDate()),
  );

  if (ngaySinh > homNayUTC) {
    return res.status(400).json({
      message: "NgaySinh không được nằm trong tương lai",
    });
  }

  const phai = Phai.trim();

  if (!["Nam", "Nữ"].includes(phai)) {
    return res.status(400).json({
      message: "Phái chỉ được nhận một trong các giá trị: 'Nam', 'Nữ'",
    });
  }

  const dienThoai = DienThoai.trim();

  if (!/^[0-9]{10,11}$/.test(dienThoai)) {
    return res.status(400).json({
      message: "DienThoai phải gồm từ 10 đến 11 chữ số",
    });
  }

  req.validatedData = {
    HoLot: HoLot.trim(),
    Ten: Ten.trim(),
    NgaySinh: ngaySinh,
    Phai: phai,
    DiaChi: DiaChi.trim(),
    DienThoai: dienThoai,
  };

  if (includeMaDocGia) {
    req.validatedData.MaDocGia = MaDocGia.trim();
  }

  next();
}

export function validateCreateDocGia(req, res, next) {
  return validateDocGiaFields(req, res, next, true);
}

export function validateUpdateDocGia(req, res, next) {
  return validateDocGiaFields(req, res, next, false);
}

export function validateMaDocGiaParam(req, res, next) {
  const { maDocGia } = req.params;

  if (!isNonEmptyString(maDocGia)) {
    return res.status(400).json({
      message: "Mã độc giả không hợp lệ",
    });
  }

  req.validatedParams = {
    maDocGia: maDocGia.trim(),
  };

  next();
}
