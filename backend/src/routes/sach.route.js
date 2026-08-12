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

const router = express.Router();

router.get("/", getAllSach);
router.get("/:maSach", validateMaSachParam, getSachByMa);
router.post("/", validateCreateSach, addSach);
router.put("/:maSach", validateMaSachParam, validateUpdateSach, editSach);
router.delete("/:maSach", validateMaSachParam, removeSach);

export default router;
