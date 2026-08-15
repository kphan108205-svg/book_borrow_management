import {
  createNhanVien,
  updateNhanVien,
  deleteNhanVien,
  changeNhanVienPassword,
  findAllNhanVien,
  findNhanVienByMSNV,
} from "../services/nhan-vien.service.js";

export async function getAllNhanVien(req, res, next) {
  try {
    const danhSachNhanVien = await findAllNhanVien(req.validatedQuery);

    return res.status(200).json(danhSachNhanVien);
  } catch (error) {
    next(error);
  }
}

export async function getNhanVienByMSNV(req, res, next) {
  try {
    const { msnv } = req.validatedParams;

    const nhanVien = await findNhanVienByMSNV(msnv);

    if (!nhanVien) {
      return res.status(404).json({
        message: `Không tìm thấy nhân viên có mã ${msnv}`,
      });
    }

    return res.status(200).json(nhanVien);
  } catch (error) {
    next(error);
  }
}

export async function addNhanVien(req, res, next) {
  try {
    const nhanVienData = req.validatedData;

    const nhanVienMoi = await createNhanVien(nhanVienData);

    if (nhanVienMoi.status === "duplicate") {
      return res.status(409).json({
        message: `Mã số nhân viên ${nhanVienData.MSNV} đã tồn tại`,
      });
    }

    return res.status(201).json({
      message: "Thêm nhân viên thành công",
      data: nhanVienMoi.data,
    });
  } catch (error) {
    next(error);
  }
}

export async function editNhanVien(req, res, next) {
  try {
    const { msnv } = req.validatedParams;
    const nhanVienData = req.validatedData;

    const nhanVienCapNhat = await updateNhanVien(msnv, nhanVienData);

    if (!nhanVienCapNhat) {
      return res.status(404).json({
        message: `Không tìm thấy nhân viên có mã ${msnv}`,
      });
    }

    return res.status(200).json({
      message: "Cập nhật nhân viên thành công",
      data: nhanVienCapNhat,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeNhanVien(req, res, next) {
  try {
    const { msnv } = req.validatedParams;

    const result = await deleteNhanVien(msnv);

    if (result.status === "not_found") {
      return res.status(404).json({
        message: `Không tìm thấy nhân viên có mã ${msnv}`,
      });
    }

    if (result.status === "in_use") {
      return res.status(409).json({
        message: `Không thể xóa nhân viên ${msnv} vì nhân viên đang phụ trách lượt mượn chưa trả`,
      });
    }

    return res.status(200).json({
      message: "Xóa nhân viên thành công",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { msnv } = req.validatedParams;
    const { CurrentPassword, NewPassword } = req.validatedData;

    const result = await changeNhanVienPassword(
      msnv,
      CurrentPassword,
      NewPassword,
    );

    if (result.status === "not_found") {
      return res.status(404).json({
        message: `Không tìm thấy nhân viên có mã ${msnv}`,
      });
    }

    if (result.status === "incorrect_password") {
      return res.status(401).json({
        message: "Mật khẩu hiện tại không chính xác",
      });
    }

    if (result.status === "same_password") {
      return res.status(400).json({
        message: "Mật khẩu mới phải khác mật khẩu hiện tại",
      });
    }

    return res.status(200).json({
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    next(error);
  }
}
