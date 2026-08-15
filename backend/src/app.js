import cors from "cors";
import express from "express";

import nhaXuatBanRouter from "./routes/nha-xuat-ban.route.js";
import sachRouter from "./routes/sach.route.js";
import docGiaRouter from "./routes/doc-gia.route.js";
import nhanVienRouter from "./routes/nhan-vien.route.js";
import theoDoiMuonSachRouter from "./routes/theo-doi-muon-sach.route.js";
import authRouter from "./routes/auth.route.js";

import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Backend đang hoạt động",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/nha-xuat-ban", nhaXuatBanRouter);
app.use("/api/sach", sachRouter);
app.use("/api/doc-gia", docGiaRouter);
app.use("/api/nhan-vien", nhanVienRouter);
app.use("/api/theo-doi-muon-sach", theoDoiMuonSachRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
