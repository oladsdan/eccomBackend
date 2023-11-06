import express from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { createBrand, deleteBrand, getABrand, getAllBrand, updateBrand } from "../controllers/brandControllers.js";


const router = express.Router();

router.post('/new-brand',authMiddleware, isAdmin, createBrand);
router.put('/:id', authMiddleware, isAdmin, updateBrand)
router.delete('/:id', authMiddleware, isAdmin, deleteBrand)
router.get('/:id', getABrand)
router.get('/', getAllBrand)

export default router

