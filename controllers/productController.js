import productModel from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

export const createProduct = asyncHandler( async (req, res) => {
    const product = req.body
    try {
        if(product?.title){
            product.slug = slugify(product.title)
        }
        const newProducts = new productModel(product)
        const productsCreated = await newProducts.save()
        res.status(201).json({productsCreated})
        
        
    } catch (error) {
        throw new Error (error)        
        
    }
})

// update product
export const updateProduct = asyncHandler (async (req, res) => {
    const {id} = req.params;
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await productModel.findByIdAndUpdate(id, req.body, {new:true})
        if(!updateProduct) return res.status(404).json("no valid product")
        res.json(updateProduct)
        
    } catch (error) {
        throw new Error(error)
        
    }
})

//delete product
export const deleteProduct = asyncHandler (async (req, res) => {
    const {id} = req.params;
    try {
        if(!id){
            return res.json("there is know id found")
        } else {
            const deletedProduct = await productModel.findByIdAndDelete(id)
            res.json({"message": `this user with ${id} has been deleted or does not exist`})
        }
            

    } catch (error) {
        throw new Error(error)
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
    console.log(req.query)
    try {
        const getAllProducts = await productModel.find()
        res.json(getAllProducts)
    } catch (error) {
        throw new Error (error)
        
    }
})