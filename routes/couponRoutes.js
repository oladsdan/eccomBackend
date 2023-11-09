import express from 'express';
import { createCoupon, deleteCoupon, getAllCoupons, updateCoupon } from '../controllers/couponController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/create-coupon', authMiddleware, isAdmin, createCoupon);
router.get('/', authMiddleware, isAdmin, getAllCoupons)
router.put('/update-coupon', authMiddleware, isAdmin, updateCoupon)
router.delete('/', authMiddleware, isAdmin, deleteCoupon)

export default router