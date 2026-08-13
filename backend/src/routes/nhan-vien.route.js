import express from "express";

import {
  validateCreateNhanVien,
  validateUpdateNhanVien,
  validateMSNVParam,
  validateChangePassword,
} from "../middlewares/nhan-vien.middleware.js";

import {
  addNhanVien,
  editNhanVien,
  removeNhanVien,
  changePassword,
  getAllNhanVien,
  getNhanVienByMSNV,
} from "../controllers/nhan-vien.controller.js";

const router = express.Router();

router.get("/", getAllNhanVien);
router.get("/:msnv", validateMSNVParam, getNhanVienByMSNV);
router.post("/", validateCreateNhanVien, addNhanVien);
router.put("/:msnv", validateMSNVParam, validateUpdateNhanVien, editNhanVien);
router.put(
  "/:msnv/password",
  validateMSNVParam,
  validateChangePassword,
  changePassword,
);
router.delete("/:msnv", validateMSNVParam, removeNhanVien);

export default router;
