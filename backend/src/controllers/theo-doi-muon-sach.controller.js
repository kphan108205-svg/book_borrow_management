import {
  createMuonSach,
  findAllMuonSach,
  findMuonSachById,
  returnSach,
} from "../services/theo-doi-muon-sach.service.js";

export async function getAllMuonSach(req, res, next) {
  try {
    const danhSachMuonSach = await findAllMuonSach(req.validatedQuery);

    return res.status(200).json(danhSachMuonSach);
  } catch (error) {
    next(error);
  }
}

export async function getMuonSachById(req, res, next) {
  try {
    const { id } = req.validatedParams;

    const luotMuon = await findMuonSachById(id);

    if (!luotMuon) {
      return res.status(404).json({
        message: "Không tìm thấy lượt mượn sách",
      });
    }

    return res.status(200).json(luotMuon);
  } catch (error) {
    next(error);
  }
}

export async function addMuonSach(req, res, next) {
  try {
    const muonSachData = req.validatedData;
    const msnv = req.auth.MSNV;

    const result = await createMuonSach(muonSachData, msnv);

    if (result.status === "reader_not_found") {
      return res.status(400).json({
        message: `Độc giả ${muonSachData.MaDocGia} không tồn tại`,
      });
    }

    if (result.status === "book_not_found") {
      return res.status(400).json({
        message: `Sách ${muonSachData.MaSach} không tồn tại`,
      });
    }

    if (result.status === "employee_not_found") {
      return res.status(401).json({
        message: "Tài khoản nhân viên không còn tồn tại",
      });
    }

    if (result.status === "already_borrowing") {
      return res.status(409).json({
        message:
          `Độc giả ${muonSachData.MaDocGia} đang mượn` +
          ` sách ${muonSachData.MaSach}`,
      });
    }

    if (result.status === "out_of_stock") {
      return res.status(409).json({
        message: `Sách ${muonSachData.MaSach} hiện không còn quyển khả dụng`,
      });
    }

    return res.status(201).json({
      message: "Lập lượt mượn sách thành công",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
}

export async function returnBorrowedBook(req, res, next) {
  try {
    const { id } = req.validatedParams;

    const result = await returnSach(id);

    if (result.status === "not_found") {
      return res.status(404).json({
        message: "Không tìm thấy lượt mượn sách",
      });
    }

    if (result.status === "already_returned") {
      return res.status(409).json({
        message: "Lượt mượn này đã được trả trước đó",
        data: result.data,
      });
    }

    return res.status(200).json({
      message: "Trả sách thành công",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
}
