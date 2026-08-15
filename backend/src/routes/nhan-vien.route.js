import express from "express";

import {
  validateCreateNhanVien,
  validateUpdateNhanVien,
  validateMSNVParam,
  validateChangePassword,
} from "../middlewares/nhan-vien.middleware.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

import {
  requireRole,
  requireSelf,
} from "../middlewares/authorization.middleware.js";

import { validateListQuery } from "../middlewares/list-query.middleware.js";

import {
  addNhanVien,
  editNhanVien,
  removeNhanVien,
  changePassword,
  getAllNhanVien,
  getNhanVienByMSNV,
} from "../controllers/nhan-vien.controller.js";

const router = express.Router();

router.use(authenticateToken);

router.put(
  "/:msnv/password",
  validateMSNVParam,
  requireSelf,
  validateChangePassword,
  changePassword,
);

router.use(requireRole("Quản lý thư viện"));

router.get("/", validateListQuery, getAllNhanVien);
router.get("/:msnv", validateMSNVParam, getNhanVienByMSNV);
router.post("/", validateCreateNhanVien, addNhanVien);
router.put("/:msnv", validateMSNVParam, validateUpdateNhanVien, editNhanVien);
router.delete("/:msnv", validateMSNVParam, removeNhanVien);

export default router;
