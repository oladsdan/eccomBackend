import express from "express";
import { Login, forgetPassword, register } from "../controllers/authControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";



const router = express.Router();

router.post('/register', register)
router.post('/login', Login)
router.put('/forget-password', authMiddleware, forgetPassword)

export default router