import { getDatabase } from "../configs/database.js";

const COLLECTION_NAME = "TheoDoiMuonSach";

export async function findMuonSachById(id) {
  const database = getDatabase();

  return database.collection(COLLECTION_NAME).findOne({ _id: id });
}

export async function findAllMuonSach(status) {
  const database = getDatabase();
  const collection = database.collection(COLLECTION_NAME);

  const now = new Date();

  const todayUTC = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
  );

  const matchCondition = {};

  if (status === "dang-muon") {
    matchCondition.NgayTra = null;
    matchCondition.HanTra = {
      $gte: todayUTC,
    };
  }

  if (status === "da-tra") {
    matchCondition.NgayTra = {
      $ne: null,
    };
  }

  if (status === "qua-han") {
    matchCondition.NgayTra = null;
    matchCondition.HanTra = {
      $lt: todayUTC,
    };
  }

  return collection
    .aggregate([
      {
        $match: matchCondition,
      },
      {
        $lookup: {
          from: "DocGia",
          localField: "MaDocGia",
          foreignField: "MaDocGia",
          as: "DocGia",
        },
      },
      {
        $lookup: {
          from: "Sach",
          localField: "MaSach",
          foreignField: "MaSach",
          as: "Sach",
        },
      },
      {
        $lookup: {
          from: "NhanVien",
          localField: "MSNV",
          foreignField: "MSNV",
          as: "NhanVien",
        },
      },
      {
        $addFields: {
          TrangThai: {
            $switch: {
              branches: [
                {
                  case: {
                    $ne: ["$NgayTra", null],
                  },
                  then: "da-tra",
                },
                {
                  case: {
                    $lt: ["$HanTra", todayUTC],
                  },
                  then: "qua-han",
                },
              ],
              default: "dang-muon",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          MaDocGia: 1,
          MaSach: 1,
          MSNV: 1,
          NgayMuon: 1,
          HanTra: 1,
          NgayTra: 1,
          TrangThai: 1,
          ThongTinDocGia: {
            HoLot: {
              $arrayElemAt: ["$DocGia.HoLot", 0],
            },
            Ten: {
              $arrayElemAt: ["$DocGia.Ten", 0],
            },
          },
          ThongTinSach: {
            TenSach: {
              $arrayElemAt: ["$Sach.TenSach", 0],
            },
            NguonGocTacGia: {
              $arrayElemAt: ["$Sach.NguonGocTacGia", 0],
            },
          },
          ThongTinNhanVien: {
            HoTenNV: {
              $arrayElemAt: ["$NhanVien.HoTenNV", 0],
            },
            ChucVu: {
              $arrayElemAt: ["$NhanVien.ChucVu", 0],
            },
          },
        },
      },
      {
        $sort: {
          NgayMuon: -1,
        },
      },
    ])
    .toArray();
}

export async function createMuonSach(muonSachData, msnv) {
  const database = getDatabase();

  const muonSachCollection = database.collection(COLLECTION_NAME);
  const docGiaCollection = database.collection("DocGia");
  const sachCollection = database.collection("Sach");
  const nhanVienCollection = database.collection("NhanVien");

  const docGia = await docGiaCollection.findOne({
    MaDocGia: muonSachData.MaDocGia,
  });

  if (!docGia) {
    return {
      status: "reader_not_found",
    };
  }

  const sach = await sachCollection.findOne({ MaSach: muonSachData.MaSach });

  if (!sach) {
    return {
      status: "book_not_found",
    };
  }

  const nhanVien = await nhanVienCollection.findOne({ MSNV: msnv });

  if (!nhanVien) {
    return {
      status: "employee_not_found",
    };
  }

  const luotMuonTrungSach = await muonSachCollection.findOne({
    MaDocGia: muonSachData.MaDocGia,
    MaSach: muonSachData.MaSach,
    NgayTra: null,
  });

  if (luotMuonTrungSach) {
    return {
      status: "already_borrowing",
    };
  }

  const soQuyenDangMuon = await muonSachCollection.countDocuments({
    MaSach: muonSachData.MaSach,
    NgayTra: null,
  });

  if (soQuyenDangMuon >= sach.SoQuyen) {
    return {
      status: "out_of_stock",
    };
  }

  const luotMuonMoi = {
    MaDocGia: muonSachData.MaDocGia,
    MaSach: muonSachData.MaSach,
    MSNV: msnv,
    NgayMuon: muonSachData.NgayMuon,
    HanTra: muonSachData.HanTra,
    NgayTra: null,
  };

  const result = await muonSachCollection.insertOne(luotMuonMoi);

  return {
    status: "created",
    data: {
      _id: result.insertedId,
      ...luotMuonMoi,
    },
  };
}

export async function returnSach(id) {
  const database = getDatabase();
  const collection = database.collection(COLLECTION_NAME);

  const luotMuon = await collection.findOne({ _id: id });

  if (!luotMuon) {
    return {
      status: "not_found",
    };
  }

  if (luotMuon.NgayTra !== null) {
    return {
      status: "already_returned",
      data: luotMuon,
    };
  }

  const ngayTra = new Date();

  const result = await collection.updateOne(
    {
      _id: id,
      NgayTra: null,
    },
    {
      $set: {
        NgayTra: ngayTra,
      },
    },
  );

  if (result.modifiedCount === 0) {
    return {
      status: "already_returned",
    };
  }

  const luotMuonDaCapNhat = await collection.findOne({ _id: id });

  return {
    status: "returned",
    data: luotMuonDaCapNhat,
  };
}
