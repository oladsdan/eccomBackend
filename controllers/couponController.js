import couponModel from "../models/couponModel.js";
import validateDBid from "../utils/validateDBid.js";
import asyncHandler from "express-async-handler";

export const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await couponModel.create(req.body);
        res.json(newCoupon)
        
    } catch (error) {
        throw new Error(error)
    }
})
export const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await couponModel.find()
        res.json(coupons)
    } catch (error) {

        
    }
})
export const updateCoupon = asyncHandler(async (req, res) => {
    const{id} = req.params;
    validateDBid(id);
    try {
        const updateCoupon = await couponModel.findByIdAndUpdate(id, req.body, {new: true});
        res.json(coupons)
    } catch (error) {
        throw new Error(error)
        
    }
});
export const deleteCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateDBid(id);
    try {
        const deletedCoupon = await couponModel.findByIdAndDelete(id);
        res.json(deletedCoupon)
    } catch (error) {
        throw new Error(error)
    }
})