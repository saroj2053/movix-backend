import express from "express";
const router = express.Router();

import { login, register } from "../controllers/userController.js";

router.route("/register").post(register);
router.route("/login").post(login);

export default router;
