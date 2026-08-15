import { getDatabase } from "../configs/database.js";
import { escapeRegex } from "../utils/regex.js";

const COLLECTION_NAME = "NhaXuatBan";

export async function findNhaXuatBanByMa(maNXB) {
  const database = getDatabase();

  return database.collection(COLLECTION_NAME).findOne({ MaNXB: maNXB });
}

export async function findAllNhaXuatBan({ page, limit, search }) {
  const database = getDatabase();
  const collection = database.collection(COLLECTION_NAME);

  const filter = {};

  if (search) {
    const searchPattern = new RegExp(escapeRegex(search), "i");

    filter.$or = [
      {
        MaNXB: searchPattern,
      },
      {
        TenNXB: searchPattern,
      },
      {
        DiaChi: searchPattern,
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, totalItems] = await Promise.all([
    collection
      .find(filter)
      .sort({ MaNXB: 1 })
      .skip(skip)
      .limit(limit)
      .toArray(),

    collection.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}

export async function createNhaXuatBan(nhaXuatBanData) {
  const database = getDatabase();
  const collection = database.collection(COLLECTION_NAME);

  const nhaXuatBanDaTonTai = await collection.findOne({
    MaNXB: nhaXuatBanData.MaNXB,
  });

  if (nhaXuatBanDaTonTai) {
    return null;
  }

  const nhaXuatBanMoi = {
    MaNXB: nhaXuatBanData.MaNXB,
    TenNXB: nhaXuatBanData.TenNXB,
    DiaChi: nhaXuatBanData.DiaChi,
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
        TenNXB: nhaXuatBanData.TenNXB,
        DiaChi: nhaXuatBanData.DiaChi,
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
  const nhaXuatBanCollection = database.collection(COLLECTION_NAME);
  const sachCollection = database.collection("Sach");

  const nhaXuatBan = await nhaXuatBanCollection.findOne({ MaNXB: maNXB });

  if (!nhaXuatBan) {
    return {
      status: "not_found",
    };
  }

  const sachDangThamChieu = await sachCollection.findOne({ MaNXB: maNXB });

  if (sachDangThamChieu) {
    return {
      status: "in_use",
    };
  }

  await nhaXuatBanCollection.deleteOne({ MaNXB: maNXB });

  return {
    status: "deleted",
    data: nhaXuatBan,
  };
}
