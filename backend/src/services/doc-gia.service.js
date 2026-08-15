import { getDatabase } from "../configs/database.js";
import { escapeRegex } from "../utils/regex.js";

const COLLECTION_NAME = "DocGia";

export async function findDocGiaByMa(maDocGia) {
  const database = getDatabase();

  return database.collection(COLLECTION_NAME).findOne({ MaDocGia: maDocGia });
}

export async function findAllDocGia({ page, limit, search }) {
  const database = getDatabase();
  const collection = database.collection(COLLECTION_NAME);

  const filter = {};

  if (search) {
    const searchPattern = new RegExp(escapeRegex(search), "i");

    filter.$or = [
      {
        MaDocGia: searchPattern,
      },
      {
        HoLot: searchPattern,
      },
      {
        Ten: searchPattern,
      },
      {
        DiaChi: searchPattern,
      },
      {
        DienThoai: searchPattern,
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, totalItems] = await Promise.all([
    collection
      .find(filter)
      .sort({ MaDocGia: 1 })
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
