import asyncHandler from "express-async-handler";
import userModel from "../models/userModet.js";
import validateDBid from "../utils/validateDBid.js";


//get all users
export const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await userModel.find();
        res.json(getUsers)
        
    } catch (error) {
        throw new Error(error);
    }
})

//get single user
export const getUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateDBid(id)
    try {
        const getSingleUser = await userModel.findById(id)
        res.status(200).json(getSingleUser)
        
    } catch (error) {
        throw new Error(error)
    }


})

//delete single user
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await userModel.findByIdAndDelete(id);
        res.status(201).json({"message":"user already deleted"})
    } catch(error){
        throw new Error(error)
    }
})

//update single user
export const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateDBid(_id);
    try {
        const updatedUser = await userModel.findByIdAndUpdate(_id, {
            lastname: req.body?.lastname,
            firstname: req.body?.firstname,
            mobile: req.body?.mobile,
            email: req.body?.email

        }, {new: true})

        res.json(updatedUser)

    } catch (error) {
        throw new Error(error)
        
    }
    
})
