import { getDatabase } from "../configs/database.js";

const COLLECTION_NAME = "NhaXuatBan";

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
