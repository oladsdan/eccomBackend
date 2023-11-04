import categoryModel from "../models/productCategoryModel.js";
import asyncHandler from  "express-async-handler";
import validateDBid from "../utils/validateDBid.js";


export const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await categoryModel.create(req.body);
        res.json(newCategory);
        
    } catch (error) {
        throw new Error(error)
        
    }
}) 

export const updateCategory = asyncHandler(async (req, res) => {
    const {id} =req.params;
    validateDBid(id)
    try {
        const updatedCategory = await categoryModel.findByIdAndUpdate(id, req.body, {new : true})
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error)
        
    }
})

export const deleteCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateDBid(id);
    try {
        const deletedCategory = await categoryModel.findByIdAndDelete(id);
        res.json(deletedCategory)

        
    } catch (error) {
        throw new Error(error )
        
    }
})

export const getACategory = asyncHandler(async (req, res) => {
    const {id} = req.paramss;
    validateDBid(id);
    try {
        const getaCategory = await categoryModel.findById(id);
        res.json(getaCategory)
    } catch (error) {
        throw new Error(error)
        
    }
})
export const getAllCategory = asyncHandler(async (req, res) => {
    
    try {
        const getaCategory = await categoryModel.findById();
        res.json(getaCategory)
    } catch (error) {
        throw new Error(error)
        
    }
})

