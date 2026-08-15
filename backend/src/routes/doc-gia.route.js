import express from "express";

import {
  validateCreateDocGia,
  validateUpdateDocGia,
  validateMaDocGiaParam,
} from "../middlewares/doc-gia.middleware.js";

import {
  addDocGia,
  editDocGia,
  removeDocGia,
  getAllDocGia,
  getDocGiaByMa,
} from "../controllers/doc-gia.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getAllDocGia);
router.get("/:maDocGia", validateMaDocGiaParam, getDocGiaByMa);
router.post("/", validateCreateDocGia, addDocGia);
router.put(
  "/:maDocGia",
  validateMaDocGiaParam,
  validateUpdateDocGia,
  editDocGia,
);
router.delete("/:maDocGia", validateMaDocGiaParam, removeDocGia);
export default router;
