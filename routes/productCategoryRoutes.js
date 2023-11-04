import express from "express";
import { createCategory, deleteCategory, getACategory, getAllCategory, updateCategory } from "../controllers/productCategoryController.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post('/new-category',authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory)
router.delete('/:id', authMiddleware, isAdmin, deleteCategory)
router.get('/:id', getACategory)
router.get('/', getAllCategory)

export default router

