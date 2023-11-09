import express from "express";
import { createBlog, deleteBlog, disLikeBlog, getABlog, getAllBlogs, likeBlog, updateBlog, uploadImages } from "../controllers/blogControllers.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { blogImgResize, uploadPhoto } from "../middleware/uploadImages.js";

const router = express.Router();

//createBlog route
router.post('/create-blog', authMiddleware, isAdmin, createBlog)
router.put('/edit-blog/:id', authMiddleware, isAdmin, updateBlog)
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array("images", 2), blogImgResize, uploadImages)
router.get("/",  getAllBlogs)
router.get("/:id", getABlog)
router.delete("/delete-blog/:id", authMiddleware, isAdmin, deleteBlog);
router.put('/likes',authMiddleware, likeBlog)
router.put('/dislikes',authMiddleware, disLikeBlog)

export default router