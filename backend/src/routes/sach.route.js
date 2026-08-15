import express from "express";

import {
  validateCreateSach,
  validateUpdateSach,
  validateMaSachParam,
} from "../middlewares/sach.middleware.js";

import {
  addSach,
  editSach,
  removeSach,
  getAllSach,
  getSachByMa,
} from "../controllers/sach.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getAllSach);
router.get("/:maSach", validateMaSachParam, getSachByMa);
router.post("/", validateCreateSach, addSach);
router.put("/:maSach", validateMaSachParam, validateUpdateSach, editSach);
router.delete("/:maSach", validateMaSachParam, removeSach);

export default router;
