/**
 * - Mở cổng và khởi động chương trình
 * */

import { loadEnvFile } from "node:process";

import app from "./app.js";
import { connectDatabase } from "./configs/database.js";

loadEnvFile();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Backend đang chạy tại cổng ${PORT}`);
    });
  } catch (error) {
    console.error("Không thể khởi động Backend: ", error.message);
    process.exit(1);
  }
}

startServer();
