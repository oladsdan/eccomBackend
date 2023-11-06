import brandModel from "../models/brandModel.js";
import asyncHandler from  "express-async-handler";
import validateDBid from "../utils/validateDBid.js";


export const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await brandModel.create(req.body);
        res.json(newBrand);
        
    } catch (error) {
        throw new Error(error)
        
    }
}) 

export const updateBrand = asyncHandler(async (req, res) => {
    const {id} =req.params;
    validateDBid(id)
    try {
        const updatedBrand = await brandModel.findByIdAndUpdate(id, req.body, {new : true})
        res.json(updatedBrand)
    } catch (error) {
        throw new Error(error)
        
    }
})

export const deleteBrand = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateDBid(id);
    try {
        const deletedBrand = await brandModel.findByIdAndDelete(id);
        res.json(deletedBrand)

        
    } catch (error) {
        throw new Error(error )
        
    }
})

export const getABrand = asyncHandler(async (req, res) => {
    const {id} = req.paramss;
    validateDBid(id);
    try {
        const getaBrand = await brandModel.findById(id);
        res.json(getaBrand)
    } catch (error) {
        throw new Error(error)
        
    }
})
export const getAllBrand = asyncHandler(async (req, res) => {
    
    try {
        const getaBrand = await brandModel.findById();
        res.json(getaBrand)
    } catch (error) {
        throw new Error(error)
        
    }
})
 

