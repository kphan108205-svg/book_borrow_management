import express from "express";

import {
  addNhaXuatBan,
  getAllNhaXuatBan,
} from "../controllers/nha-xuat-ban.controller.js";

const router = express.Router();

router.get("/", getAllNhaXuatBan);
router.post("/", addNhaXuatBan);

export default router;
