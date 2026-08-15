import express from "express";

import {
  addNhaXuatBan,
  editNhaXuatBan,
  removeNhaXuatBan,
  getAllNhaXuatBan,
  getNhaXuatBanByMa,
} from "../controllers/nha-xuat-ban.controller.js";

import {
  validateCreateNhaXuatBan,
  validateUpdateNhaXuatBan,
  validateMaNXBParam,
} from "../middlewares/nha-xuat-ban.middleware.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

import { validateListQuery } from "../middlewares/list-query.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", validateListQuery, getAllNhaXuatBan);
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
