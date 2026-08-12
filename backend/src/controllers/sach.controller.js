import {
  createSach,
  updateSach,
  deleteSach,
  findAllSach,
  findSachByMa,
} from "../services/sach.service.js";

export async function getAllSach(req, res, next) {
  try {
    const danhSach = await findAllSach();

    return res.status(200).json(danhSach);
  } catch (error) {
    next(error);
  }
}

export async function getSachByMa(req, res, next) {
  try {
    const { maSach } = req.validatedParams;

    const sach = await findSachByMa(maSach);

    if (!sach) {
      return res.status(404).json({
        message: `Không tìm thấy sách có mã ${maSach}`,
      });
    }

    return res.status(200).json(sach);
  } catch (error) {
    next(error);
  }
}

export async function addSach(req, res, next) {
  try {
    const sachData = req.validatedData;

    const sachMoi = await createSach(sachData);

    if (sachMoi.status === "duplicate") {
      return res.status(409).json({
        message: `Mã sách ${sachData.MaSach} đã tồn tại`,
      });
    }

    if (sachMoi.status === "publisher_not_found") {
      return res.status(400).json({
        message: `Nhà xuất bản có mã ${sachData.MaNXB} không tồn tại`,
      });
    }

    return res.status(201).json({
      message: "Thêm sách thành công",
      data: sachMoi.data,
    });
  } catch (error) {
    next(error);
  }
}

export async function editSach(req, res, next) {
  try {
    const { maSach } = req.validatedParams;
    const sachData = req.validatedData;

    const sachCapNhat = await updateSach(maSach, sachData);

    if (sachCapNhat.status === "not_found") {
      return res.status(404).json({
        message: `Không tìm thấy sách có mã ${maSach}`,
      });
    }

    if (sachCapNhat.status === "publisher_not_found") {
      return res.status(400).json({
        message: `Nhà xuất bản có mã ${sachData.MaNXB} không tồn tại`,
      });
    }

    if (sachCapNhat.status === "quantity_conflict") {
      return res.status(409).json({
        message:
          `Không thể đặt SoQuyen thành ${sachData.SoQuyen}` +
          `vì đang có ${sachCapNhat.borrowedQuantity}`,
      });
    }

    return res.status(200).json({
      message: "Cập nhật sách thành công",
      data: sachCapNhat.data,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeSach(req, res, next) {
  try {
    const { maSach } = req.validatedParams;

    const result = await deleteSach(maSach);

    if (result.status === "not_found") {
      return res.status(404).json({
        message: `Không tìm thấy sách có mã ${maSach}`,
      });
    }

    if (result.status === "in_use") {
      return res.status(409).json({
        message: `Không thể xóa sách ${maSach} vì sách đang được mươn`,
      });
    }

    return res.status(200).json({
      message: "Xóa sách thành công",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
}
