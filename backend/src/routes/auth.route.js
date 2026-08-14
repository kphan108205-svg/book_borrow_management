import express from "express";

import {
  authenticateToken,
  validateLogin,
} from "../middlewares/auth.middleware.js";

import { getCurrentNhanVien, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", validateLogin, login);
router.get("/me", authenticateToken, getCurrentNhanVien);

export default router;
