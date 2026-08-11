import {
  createNhaXuatBan,
  updateNhaXuatBan,
  deleteNhaXuatBan,
  findAllNhaXuatBan,
  findNhaXuatBanByMa,
} from "../services/nha-xuat-ban.service.js";

export async function getAllNhaXuatBan(req, res, next) {
  try {
    const danhSachNhaXuatBan = await findAllNhaXuatBan();

    return res.status(200).json(danhSachNhaXuatBan);
  } catch (error) {
    next(error);
  }
}

export async function getNhaXuatBanByMa(req, res, next) {
  try {
    const maNXB = req.params.maNXB.trim();

    const nhaXuatBan = await findNhaXuatBanByMa(maNXB);

    if (!nhaXuatBan) {
      return res.status(404).json({
        message: `Không tìm thấy nhà xuất bản có mã ${maNXB}`,
      });
    }

    return res.status(200).json(nhaXuatBan);
  } catch (error) {
    next(error);
  }
}

export async function addNhaXuatBan(req, res, next) {
  try {
    const { MaNXB, TenNXB, DiaChi } = req.body;

    const cacTruongHopLe = [MaNXB, TenNXB, DiaChi].every(
      (value) => typeof value === "string" && value.trim() !== "",
    );

    if (!cacTruongHopLe) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
      });
    }

    const nhaXuatBanMoi = await createNhaXuatBan({
      MaNXB,
      TenNXB,
      DiaChi,
    });

    if (!nhaXuatBanMoi) {
      return res.status(409).json({
        message: `Mã nhà xuất bản ${MaNXB.trim()} đã tồn tại`,
      });
    }

    return res.status(201).json({
      message: "Thêm nhà xuất bản thành công",
      data: nhaXuatBanMoi,
    });
  } catch (error) {
    next(error);
  }
}

export async function editNhaXuatBan(req, res, next) {
  try {
    const maNXB = req.params.maNXB.trim();
    const { TenNXB, DiaChi } = req.body;

    const cacTruongHopLe = [TenNXB, DiaChi].every(
      (value) => typeof value === "string" && value.trim() !== "",
    );

    if (!cacTruongHopLe) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
      });
    }

    const nhaXuatBanCapNhat = await updateNhaXuatBan(maNXB, {
      TenNXB,
      DiaChi,
    });

    if (!nhaXuatBanCapNhat) {
      return res.status(404).json({
        message: `Không tìm thấy nhà xuất bản có mã ${maNXB}`,
      });
    }

    return res.status(200).json({
      message: "Cập nhật nhà xuất bản thành công",
      data: nhaXuatBanCapNhat,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeNhaXuatBan(req, res, next) {
  try {
    const maNXB = req.params.maNXB.trim();

    const result = await deleteNhaXuatBan(maNXB);

    if (result.status === "not_found") {
      return res.status(404).json({
        message: `Không tìm thấy nhà xuất bản có mã ${maNXB}`,
      });
    }

    if (result.status === "in_use") {
      return res.status(409).json({
        message:
          "Không thể xóa nhà xuất bản vì vẫn còn sách thuộc nhà xuất bản này",
      });
    }

    return res.status(200).json({
      message: "Xóa nhà xuất bản thành công",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
}
