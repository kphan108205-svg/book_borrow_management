import { getDatabase } from "../configs/database.js";

const COLLECTION_NAME = "NhaXuatBan";

export async function findNhaXuatBanByMa(maNXB) {
  const database = getDatabase();

  return database.collection(COLLECTION_NAME).findOne({ MaNXB: maNXB });
}

export async function findAllNhaXuatBan() {
  const database = getDatabase();

  return database
    .collection(COLLECTION_NAME)
    .find({})
    .sort({ MaNXB: 1 })
    .toArray();
}

export async function createNhaXuatBan(nhaXuatBanData) {
  const database = getDatabase();
  const collection = database.collection(COLLECTION_NAME);

  const maNXB = nhaXuatBanData.MaNXB.trim();
  const tenNXB = nhaXuatBanData.TenNXB.trim();
  const diaChi = nhaXuatBanData.DiaChi.trim();

  const nhaXuatBanDaTonTai = await collection.findOne({ maNXB: maNXB });

  if (nhaXuatBanDaTonTai) {
    return nulll;
  }

  const nhaXuatBanMoi = {
    MaNXB: maNXB,
    TenNXB: tenNXB,
    DiaChi: diaChi,
  };

  const result = await collection.insertOne(nhaXuatBanMoi);

  return {
    _id: result.insertedId,
    ...nhaXuatBanMoi,
  };
}

export async function updateNhaXuatBan(maNXB, nhaXuatBanData) {
  const database = getDatabase();
  const collection = database.collection(COLLECTION_NAME);
  const result = await collection.updateOne(
    { MaNXB: maNXB },
    {
      $set: {
        TenNXB: nhaXuatBanData.TenNXB.trim(),
        DiaChi: nhaXuatBanData.DiaChi.trim(),
      },
    },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return collection.findOne({ MaNXB: maNXB });
}

export async function deleteNhaXuatBan(maNXB) {
  const database = getDatabase();
  const collectionNhaXuatBan = database.collection(COLLECTION_NAME);
  const collectionSach = database.collection("Sach");

  const nhaXuatBan = await findNhaXuatBanByMa(maNXB);

  if (!nhaXuatBan) {
    return {
      status: "not_found",
    };
  }

  const sachDangThamChieu = await collectionSach.findOne({ MaNXB: maNXB });

  if (sachDangThamChieu) {
    return {
      status: "in_use",
    };
  }

  await collectionNhaXuatBan.deleteOne({ MaNXB: maNXB });

  return {
    status: "deleted",
    data: nhaXuatBan,
  };
}
