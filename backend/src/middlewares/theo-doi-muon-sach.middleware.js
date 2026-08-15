import { ObjectId } from "mongodb";

import { isNonEmptyString, parseDateOnly } from "../utils/validation.js";

export function validateCreateMuonSach(req, res, next) {
  const { MaDocGia, MaSach, NgayMuon, HanTra } = req.body;

  if (!isNonEmptyString(MaDocGia) || !isNonEmptyString(MaSach)) {
    return res.status(400).json({
      message: "MaDocGia và MaSach đều phải là chuỗi không rỗng",
    });
  }

  const ngayMuon = parseDateOnly(NgayMuon);
  const hanTra = parseDateOnly(HanTra);

  if (hanTra <= ngayMuon) {
    return res.status(400).json({
      message: "HanTra phải sau NgayMuon",
    });
  }

  req.validatedData = {
    MaDocGia: MaDocGia.trim(),
    MaSach: MaSach.trim(),
    NgayMuon: ngayMuon,
    HanTra: hanTra,
  };

  next();
}

export function validateBorrowingIdParam(req, res, next) {
  const { id } = req.params;

  if (
    typeof id !== "string" ||
    !/^[0-9a-fA-F]{24}$/.test(id) ||
    !ObjectId.isValid(id)
  ) {
    return res.status(400).json({
      message: "ID lượt mượn không hợp lệ",
    });
  }

  req.validatedParams = {
    id: new ObjectId(id),
  };

  next();
}

export function validateBorrowingStatusQuery(req, res, next) {
  const { status } = req.query;

  if (status === undefined) {
    req.validatedQuery = {
      status: null,
    };

    return next();
  }

  const allowedStatuses = ["dang-muon", "da-tra", "qua-han"];

  if (typeof status !== "string" || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      message:
        "status chỉ được nhận một trong các giá trị: dang-muon, da-tra, quan-han",
    });
  }

  req.validatedQuery = {
    status,
  };

  next();
}
