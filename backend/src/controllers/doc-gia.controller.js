import {
  createDocGia,
  updateDocGia,
  deleteDocGia,
  findAllDocGia,
  findDocGiaByMa,
} from "../services/doc-gia.service.js";

export async function getAllDocGia(req, res, next) {
  try {
    const danhSachDocGia = await findAllDocGia(req.validatedQuery);

    return res.status(200).json(danhSachDocGia);
  } catch (error) {
    next(error);
  }
}

export async function getDocGiaByMa(req, res, next) {
  try {
    const { maDocGia } = req.validatedParams;

    const docGia = await findDocGiaByMa(maDocGia);

    if (!docGia) {
      return res.status(400).json({
        message: `Không tìm thấy độc giả có mã ${maDocGia}`,
      });
    }

    return res.status(200).json(docGia);
  } catch (error) {
    next(error);
  }
}

export async function addDocGia(req, res, next) {
  try {
    const docGiaData = req.validatedData;

    const docGiaMoi = await createDocGia(docGiaData);

    if (docGiaMoi.status === "duplicate") {
      return res.status(409).json({
        message: `Mã độc giả ${docGiaData.MaDocGia} đã tồn tại`,
      });
    }

    return res.status(201).json({
      message: "Thêm độc giả thành công",
      data: docGiaMoi.data,
    });
  } catch (error) {
    next(error);
  }
}

export async function editDocGia(req, res, next) {
  try {
    const { maDocGia } = req.validatedParams;
    const docGiaData = req.validatedData;

    const docGiaCapNhat = await updateDocGia(maDocGia, docGiaData);

    if (!docGiaCapNhat) {
      return res.status(404).json({
        message: `Không tìm thấy độc giả có mã ${maDocGia}`,
      });
    }

    return res.status(200).json({
      message: "Cập nhật độc giả thành công",
      data: docGiaCapNhat,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeDocGia(req, res, next) {
  try {
    const { maDocGia } = req.validatedParams;

    const result = await deleteDocGia(maDocGia);

    if (result.status === "not_found") {
      return res.status(404).json({
        message: `Không tìm thấy độc giả có mã ${maDocGia}`,
      });
    }

    if (result.status === "in_use") {
      return res.status(409).json({
        message: `Không thể xóa độc giả ${maDocGia} vì độc giả vẫn đang mượn sách`,
      });
    }

    return res.status(200).json({
      message: "Xóa độc giả thành công",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
}
