import userModel from "../models/userModet.js";
import jwt  from "jsonwebtoken";
import asyncHandler from "express-async-handler"

export const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                const user = await userModel.findById(decoded?.UserInfo?.userid)
                req.user = user;
                // console.log(req.user)
                next()
                
            } 
        } catch (error) {
            throw new Error("Not Authorized token expired, Please Login again")
        }

    } else {
        throw new Error("There is no token attached to header")
    }
})

export const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await userModel.findOne({email})
    if(adminUser.roles?.Admin !== 3000){
        throw new Error("You are not an admin")
    } else{
        next()
    }
})