import asyncHandler from "express-async-handler";
import userModel from "../models/userModet.js";
import validateDBid from "../utils/validateDBid.js";
import jwt from  "jsonwebtoken";

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

// handle refresh Token
export const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await userModel.findOne({refreshToken})
    if(!user) throw new Error('No Refresh token present in db or not matched')
    //verify the token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token")
        }
        // we generate new token
        // const accessToken = jwt.sign({user._id}, process.env.ACCESS_TOKEN_SECRET,
        //     { expiresIn: '1m'})
        const accessToken = jwt.sign(
            {
                "user":user._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m'}
        )
        res.json({accessToken})
    })
    // res.json(user);
})

/**Logout Functionality */
export const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await userModel.findOne({ refreshToken});
    if(!user) {
        res.clearCookie("refreshToken", { httpOnly:true, secure:true})
        return res.sendStatus(204); //forbidden
    }
    await userModel.findOneAndUpdate({refreshToken : ""})
    res.clearCookie("refreshToken", { httpOnly:true, secure:true})
    return res.sendStatus(204)

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
