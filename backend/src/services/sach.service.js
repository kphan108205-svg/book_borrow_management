import { getDatabase } from "../configs/database.js";

const COLLECTION_NAME = "Sach";

export async function findSachByMa(maSach) {
  const database = getDatabase();

  return database.collection(COLLECTION_NAME).findOne({ MaSach: maSach });
}

export async function findAllSach() {
  const database = getDatabase();

  return database
    .collection(COLLECTION_NAME)
    .find({})
    .sort({ MaSach: 1 })
    .toArray();
}

export async function createSach(sachData) {
  const database = getDatabase();
  const sachCollection = database.collection(COLLECTION_NAME);
  const nhaXuatBanCollection = database.collection("NhaXuatBan");

  const sachDaTonTai = await sachCollection.findOne({
    MaSach: sachData.MaSach,
  });

  if (sachDaTonTai) {
    return {
      status: "duplicate",
    };
  }

  const nhaXuatBan = await nhaXuatBanCollection.findOne({
    MaNXB: sachData.MaNXB,
  });

  if (!nhaXuatBan) {
    return {
      status: "publisher_not_found",
    };
  }

  const sachMoi = {
    MaSach: sachData.MaSach,
    TenSach: sachData.TenSach,
    DonGia: sachData.DonGia,
    SoQuyen: sachData.SoQuyen,
    NamXuatBan: sachData.NamXuatBan,
    MaNXB: sachData.MaNXB,
    NguonGocTacGia: sachData.NguonGocTacGia,
  };

  const result = await sachCollection.insertOne(sachMoi);

  return {
    status: "created",
    data: {
      _id: result.insertedId,
      ...sachMoi,
    },
  };
}

export async function updateSach(maSach, sachData) {
  const database = getDatabase();
  const nhaXuatBanCollection = database.collection(COLLECTION_NAME);
  const sachCollection = database.collection("Sach");
  const muonSachCollection = database.collection("TheoDoiMuonSach");

  const sach = await sachCollection.findOne({ MaSach: maSach });

  if (!sach) {
    return {
      status: "not_found",
    };
  }

  const nhaXuatBan = await nhaXuatBanCollection.findOne({
    MaNXB: sachData.MaNXB,
  });

  if (!nhaXuatBan) {
    return {
      status: "publisher_not_found",
    };
  }

  const soQuyenDangMuon = await muonSachCollection.countDocuments({
    MaSach: maSach,
    NgayTra: null,
  });

  if (sachData.SoQuyen < soQuyenDangMuon) {
    return {
      status: "quantity_conflict",
      borrowedQuantity: soQuyenDangMuon,
    };
  }

  await sachCollection.updateOne(
    { MaSach: maSach },
    {
      $set: {
        TenSach: sachData.TenSach,
        DonGia: sachData.DonGia,
        SoQuyen: sachData.SoQuyen,
        NamXuatBan: sachData.NamXuatBan,
        MaNXB: sachData.MaNXB,
        NguonGocTacGia: sachData.NguonGocTacGia,
      },
    },
  );

  const result = await sachCollection.findOne({ MaSach: maSach });

  return {
    status: "updated",
    data: result,
  };
}

export async function deleteSach(maSach) {
  const database = getDatabase();
  const sachCollection = database.collection(COLLECTION_NAME);
  const muonSachCollection = database.collection("TheoDoiMuonSach");

  const sach = await sachCollection.findOne({ MaSach: maSach });

  if (!sach) {
    return {
      status: "not_found",
    };
  }

  const sachDuocMuon = await muonSachCollection.findOne({
    MaSach: maSach,
    NgayTra: null,
  });

  if (sachDuocMuon) {
    return {
      status: "in_use",
    };
  }

  await sachCollection.deleteOne({ MaSach: maSach });

  return {
    status: "deleted",
    data: sach,
  };
}
