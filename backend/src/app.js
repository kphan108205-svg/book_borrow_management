import cors from "cors";
import express from "express";

import nhaXuatBanRouter from "./routes/nha-xuat_ban.route.js";
import sachRouter from "./routes/sach.route.js";
import docGiaRouter from "./routes/doc-gia.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Backend đang hoạt động",
  });
});

app.use("/api/nha-xuat-ban", nhaXuatBanRouter);
app.use("/api/sach", sachRouter);
app.use("/api/doc-gia", docGiaRouter);

app.use((error, req, res, next) => {
  console.log(error);

  res.status(500).json({
    message: "Đã xảy ra lỗi trên máy chủ",
  });
});

export default app;
