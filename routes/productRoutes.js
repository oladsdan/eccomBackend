import express from 'express'
import { addToWishList, createProduct, deleteProduct, getAllProduct, getSingleProduct, rating, updateProduct, uploadImages } from '../controllers/productController.js'
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
import { productImgResize, uploadPhoto } from '../middleware/uploadImages.js';
const router = express.Router()

router.post('/', authMiddleware, isAdmin, createProduct);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages)
router.get("/:id", getSingleProduct)
router.get("/", getAllProduct)
router.put('/rating', authMiddleware, rating)
router.put('/wishlist', authMiddleware, addToWishList)
router.put("/:id", authMiddleware, isAdmin, updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)

export default router 