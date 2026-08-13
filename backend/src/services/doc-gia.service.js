import { getDatabase } from "../configs/database.js";

const COLLECTION_NAME = "DocGia";

export async function findDocGiaByMa(maDocGia) {
  const database = getDatabase();

  return database.collection(COLLECTION_NAME).findOne({ MaDocGia: maDocGia });
}

export async function findAllDocGia() {
  const database = getDatabase();

  return database
    .collection(COLLECTION_NAME)
    .find({})
    .sort({ MaDocGia: 1 })
    .toArray();
}

export async function createDocGia(docGiaData) {
  const database = getDatabase();
  const collection = database.collection(COLLECTION_NAME);

  const docGiaDaTonTai = await collection.findOne({
    MaDocGia: docGiaData.MaDocGia,
  });

  if (docGiaDaTonTai) {
    return {
      status: "duplicate",
    };
  }

  const docGiaMoi = {
    MaDocGia: docGiaData.MaDocGia,
    HoLot: docGiaData.HoLot,
    Ten: docGiaData.Ten,
    NgaySinh: docGiaData.NgaySinh,
    Phai: docGiaData.Phai,
    DiaChi: docGiaData.DiaChi,
    DienThoai: docGiaData.DienThoai,
  };

  const result = await collection.insertOne(docGiaMoi);

  return {
    status: "created",
    data: {
      _id: result.insertedId,
      ...docGiaMoi,
    },
  };
}

export async function updateDocGia(maDocGia, docGiaData) {
  const database = getDatabase();
  const collection = database.collection(COLLECTION_NAME);

  const result = await collection.updateOne(
    { MaDocGia: maDocGia },
    {
      $set: {
        HoLot: docGiaData.HoLot,
        Ten: docGiaData.Ten,
        NgaySinh: docGiaData.NgaySinh,
        Phai: docGiaData.Phai,
        DiaChi: docGiaData.DiaChi,
        DienThoai: docGiaData.DienThoai,
      },
    },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return collection.findOne({ MaDocGia: maDocGia });
}

export async function deleteDocGia(maDocGia) {
  const database = getDatabase();
  const docGiaCollection = database.collection(COLLECTION_NAME);
  const muonSachCollection = database.collection("TheoDoiMuonSach");

  const docGia = await docGiaCollection.findOne({ MaDocGia: maDocGia });

  if (!docGia) {
    return {
      status: "not_found",
    };
  }

  const luotMuonChuaTra = await muonSachCollection.findOne({
    MaDocGia: maDocGia,
    NgayTra: null,
  });

  if (luotMuonChuaTra) {
    return {
      status: "in_use",
    };
  }

  await docGiaCollection.deleteOne({ MaDocGia: maDocGia });

  return {
    status: "deleted",
    data: docGia,
  };
}
