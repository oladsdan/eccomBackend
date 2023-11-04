import express from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { createBlogCategory, deleteBlogCategory, getABlogCategory, getAllBlogCategory, updateBlogCategory } from "../controllers/blogCategoryControllers.js";


const router = express.Router();

router.post('/new-category',authMiddleware, isAdmin, createBlogCategory);
router.put('/:id', authMiddleware, isAdmin, updateBlogCategory)
router.delete('/:id', authMiddleware, isAdmin, deleteBlogCategory)
router.get('/:id', getABlogCategory)
router.get('/', getAllBlogCategory)

export default router

