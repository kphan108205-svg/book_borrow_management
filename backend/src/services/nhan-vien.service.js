import bcrypt, { compare } from "bcrypt";

import { getDatabase } from "../configs/database.js";

const COLLECTION_NAME = "NhanVien";
const SALT_ROUNDS = 12;

function excludePasswordHash(nhanVien) {
  if (!nhanVien) {
    return null;
  }

  const { PasswordHash, ...nhanVienAnToan } = nhanVien;

  return nhanVienAnToan;
}

export async function findNhanVienByMSNV(msnv) {
  const database = getDatabase();

  const nhanVien = await database
    .collection(COLLECTION_NAME)
    .findOne({ MSNV: msnv });

  return excludePasswordHash(nhanVien);
}

export async function findAllNhanVien() {
  const database = getDatabase();

  const danhSachNhanVien = await database
    .collection(COLLECTION_NAME)
    .find({})
    .sort({ MSNV: 1 })
    .toArray();

  return danhSachNhanVien.map(excludePasswordHash);
}

export async function createNhanVien(nhanVienData) {
  const database = getDatabase();
  const collection = database.collection(COLLECTION_NAME);

  const nhanVienDaTonTai = await collection.findOne({
    MSNV: nhanVienData.MSNV,
  });

  if (nhanVienDaTonTai) {
    return {
      status: "duplicate",
    };
  }

  const passwordHash = await bcrypt.hash(nhanVienData.Password, SALT_ROUNDS);

  const nhanVienMoi = {
    MSNV: nhanVienData.MSNV,
    HoTenNV: nhanVienData.HoTenNV,
    PasswordHash: passwordHash,
    ChucVu: nhanVienData.ChucVu,
    DiaChi: nhanVienData.DiaChi,
    SoDienThoai: nhanVienData.SoDienThoai,
  };

  const result = await collection.insertOne(nhanVienMoi);

  return {
    status: "created",
    data: {
      _id: result.insertedId,
      ...excludePasswordHash(nhanVienMoi),
    },
  };
}

export async function updateNhanVien(msnv, nhanVienData) {
  const database = getDatabase();
  const collection = database.collection(COLLECTION_NAME);

  const result = await collection.updateOne(
    {
      MSNV: msnv,
    },
    {
      $set: {
        HoTenNV: nhanVienData.HoTenNV,
        ChucVu: nhanVienData.ChucVu,
        DiaChi: nhanVienData.DiaChi,
        SoDienThoai: nhanVienData.SoDienThoai,
      },
    },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  const nhanVienCapNhat = await collection.findOne({ MSNV: msnv });

  return excludePasswordHash(nhanVienCapNhat);
}

export async function deleteNhanVien(msnv) {
  const database = getDatabase();
  const nhanVienCollection = database.collection(COLLECTION_NAME);
  const muonSachCollection = database.collection("TheoDoiMuonSach");

  const nhanVien = await nhanVienCollection.findOne({ MSNV: msnv });

  if (!nhanVien) {
    return {
      status: "not_found",
    };
  }

  const luotMuonChuaTra = await muonSachCollection.findOne({
    MSNV: msnv,
    NgayTra: null,
  });

  if (luotMuonChuaTra) {
    return {
      status: "in_use",
    };
  }

  await nhanVienCollection.deleteOne({ MSNV: msnv });

  return {
    status: "deleted",
    data: excludePasswordHash(nhanVien),
  };
}

export async function changeNhanVienPassword(
  msnv,
  currentPassword,
  newPassword,
) {
  const database = getDatabase();
  const collection = database.collection(COLLECTION_NAME);

  const nhanVien = await collection.findOne({ MSNV: msnv });

  if (!nhanVien) {
    return {
      status: "not_found",
    };
  }

  const currentPasswordIsCorrect = await bcrypt.compare(
    currentPassword,
    nhanVien.PasswordHash,
  );

  if (!currentPasswordIsCorrect) {
    return {
      status: "incorrect_password",
    };
  }

  const newPasswordMatchesCurrentHash = await bcrypt.compare(
    newPassword,
    nhanVien.PasswordHash,
  );

  if (newPasswordMatchesCurrentHash) {
    return {
      status: "same_password",
    };
  }

  const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await collection.updateOne(
    {
      MSNV: msnv,
    },
    {
      $set: {
        PasswordHash: newPasswordHash,
      },
    },
  );

  return {
    status: "updated",
  };
}
