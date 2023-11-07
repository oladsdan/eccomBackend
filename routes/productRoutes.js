import express from 'express'
import { addToWishList, createProduct, deleteProduct, getAllProduct, getSingleProduct, rating, updateProduct } from '../controllers/productController.js'
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router()

router.post('/', authMiddleware, isAdmin, createProduct);
router.get("/:id", getSingleProduct)
router.get("/", getAllProduct)
router.put('/rating', authMiddleware, rating)
router.put('/wishlist', authMiddleware, addToWishList)
router.put("/:id", authMiddleware, isAdmin, updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)

export default router 