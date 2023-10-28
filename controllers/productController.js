import productModel from "../models/productModel.js";
import asyncHandler from "express-async-handler";

export const createProduct = asyncHandler( async (req, res) => {
    const product = req.body
    try {
        const newProducts = new productModel(product)
        const productsCreated = await newProducts.save()
        res.status(201).json({productsCreated})
        
        
    } catch (error) {
        throw new Error (error)
        
    }
})

//GETTING A PRODUCT
export const getSingleProduct = asyncHandler( async (req, res) => {
    const {id} = req.params;
    try {
        const productComponent = await productModel.findById(id);
        if(!productComponent)
            return res.status(404)
        res.json(productComponent)
        
    } catch (error) {
        throw new Error (error)
    }
})

export const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const getAllProducts = await productModel.find()
        res.json(getAllProducts)
    } catch (error) {
        throw new Error (error)
        
    }
})