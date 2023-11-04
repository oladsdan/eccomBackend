import blogCategoryModel from "../models/blogCategoryModel.js";
import asyncHandler from  "express-async-handler";
import validateDBid from "../utils/validateDBid.js";


export const createBlogCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await blogCategoryModel.create(req.body);
        res.json(newCategory);
        
    } catch (error) {
        throw new Error(error)
        
    }
}) 

export const updateBlogCategory = asyncHandler(async (req, res) => {
    const {id} =req.params;
    validateDBid(id)
    try {
        const updatedCategory = await blogCategoryModel.findByIdAndUpdate(id, req.body, {new : true})
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error)
        
    }
})

export const deleteBlogCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateDBid(id);
    try {
        const deletedCategory = await blogCategoryModel.findByIdAndDelete(id);
        res.json(deletedCategory)

        
    } catch (error) {
        throw new Error(error )
        
    }
})

export const getABlogCategory = asyncHandler(async (req, res) => {
    const {id} = req.paramss;
    validateDBid(id);
    try {
        const getaCategory = await blogCategoryModel.findById(id);
        res.json(getaCategory)
    } catch (error) {
        throw new Error(error)
        
    }
})
export const getAllBlogCategory = asyncHandler(async (req, res) => {
    
    try {
        const getaCategory = await blogCategoryModel.findById();
        res.json(getaCategory)
    } catch (error) {
        throw new Error(error)
        
    }
})

