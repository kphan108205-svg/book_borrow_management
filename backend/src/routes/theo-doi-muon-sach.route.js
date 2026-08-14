import express from "express";

import {
  addMuonSach,
  getAllMuonSach,
  getMuonSachById,
  returnBorrowedBook,
} from "../controllers/theo-doi-muon-sach.controller.js";

import {
  validateCreateMuonSach,
  validateBorrowingIdParam,
  validateBorrowingStatusQuery,
} from "../middlewares/theo-doi-muon-sach.middleware.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", validateBorrowingStatusQuery, getAllMuonSach);
router.get("/:id", validateBorrowingIdParam, getMuonSachById);
router.post("/", validateCreateMuonSach, addMuonSach);
router.patch("/:id/tra-sach", validateBorrowingIdParam, returnBorrowedBook);

export default router;
