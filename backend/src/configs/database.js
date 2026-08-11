import { MongoClient } from "mongodb";

let client;
let database;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DATABASE;

  if (!uri) {
    throw new Error("MONGODB_URI not found");
  }

  if (!databaseName) {
    throw new Error("MONGODB_DATABASE not found");
  }

  client = new MongoClient(uri);
  await client.connect();

  database = client.db(databaseName);
  await database.command({ ping: 1 });

  console.log("Kết nối cơ sở dữ liệu thành công!");
}

export async function createDatabaseIndexes() {
  const database = getDatabase();

  await database
    .collection("NhaXuatBan")
    .createIndex({ MaNXB: 1 }, { unique: true });

  console.log("Đã kiểm tra các index của MongoDB");
}

export function getDatabase() {
  if (!database) {
    throw new Error("MongoDB chưa được kết nối");
  }

  return database;
}
