import express from 'express'
import { createProduct, getAllProduct, getSingleProduct } from '../controllers/productController.js'
const router = express.Router()

router.post('/', createProduct);
router.get("/:id", getSingleProduct)
router.get("/", getAllProduct)

export default router 