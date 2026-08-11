import express from "express";

import {
  addNhaXuatBan,
  editNhaXuatBan,
  removeNhaXuatBan,
  getAllNhaXuatBan,
  getNhaXuatBanByMa,
} from "../controllers/nha-xuat-ban.controller.js";

const router = express.Router();

router.get("/", getAllNhaXuatBan);
router.get("/:maNXB", getNhaXuatBanByMa);
router.post("/", addNhaXuatBan);
router.put("/:maNXB", editNhaXuatBan);
router.delete("/:maNXB", removeNhaXuatBan);

export default router;
