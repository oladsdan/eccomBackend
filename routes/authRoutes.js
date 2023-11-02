import express from "express";
import { Login, forgetPassword, register, resetPassword, resetPasswordToken } from "../controllers/authControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";



const router = express.Router();

router.post('/register', register)
router.post('/login', Login)
router.post('/reset-password', resetPassword)
router.put('/reset-password/:token', resetPasswordToken)
router.put('/forget-password', authMiddleware, forgetPassword)

export default router