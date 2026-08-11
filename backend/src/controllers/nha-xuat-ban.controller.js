import {
  createNhaXuatBan,
  findAllNhaXuatBan,
} from "../services/nha-xuat-ban.service.js";

export async function getAllNhaXuatBan(req, res, next) {
  try {
    const danhSachNhaXuatBan = await findAllNhaXuatBan();

    res.status(200).json(danhSachNhaXuatBan);
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
