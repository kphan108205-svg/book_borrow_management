import { loadEnvFile } from "node:process";

import app from "./app.js";
import { createDatabaseIndexes, connectDatabase } from "./configs/database.js";

loadEnvFile();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectDatabase();
    await createDatabaseIndexes();

    app.listen(PORT, () => {
      console.log(`Backend đang chạy tại cổng ${PORT}`);
    });
  } catch (error) {
    console.error("Không thể khởi động Backend: ", error.message);
    process.exit(1);
  }
}

startServer();
