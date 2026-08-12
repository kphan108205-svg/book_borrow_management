import express from "express";

import {
  validateCreateNhaXuatBan,
  validateUpdateNhaXuatBan,
  validateMaNXBParam,
} from "../middlewares/nha-xuat-ban.middleware.js";

import {
  addNhaXuatBan,
  editNhaXuatBan,
  removeNhaXuatBan,
  getAllNhaXuatBan,
  getNhaXuatBanByMa,
} from "../controllers/nha-xuat-ban.controller.js";

const router = express.Router();

router.get("/", getAllNhaXuatBan);
router.get("/:maNXB", validateMaNXBParam, getNhaXuatBanByMa);
router.post("/", validateCreateNhaXuatBan, addNhaXuatBan);
router.put(
  "/:maNXB",
  validateMaNXBParam,
  validateUpdateNhaXuatBan,
  editNhaXuatBan,
);
router.delete("/:maNXB", validateMaNXBParam, removeNhaXuatBan);

export default router;
