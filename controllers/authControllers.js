import userModel from "../models/userModet.js"
import bcrypt from 'bcrypt';
import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import generateRefreshToken from "../config/refreshToken.js";
import cookie from "cookie-parser";
import validateDBid from "../utils/validateDBid.js";
import crypto from "crypto"
dotenv.config();


export const register = asyncHandler( async (req, res) => {
    try {
        const {email, password, lastname} = req.body
        // console.log(email)
        const createUser = req.body
        // console.log(createUser)
        //we find if the email already exist
        const existEmail = await userModel.findOne({email :email}).exec();
        if(!existEmail){
            //proceeds to register
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt)
            const newUser = new userModel({...createUser, password: passwordHash})
            console.log(newUser)
            const savedUser = await newUser.save();
            res.status(201).json({'message': `${lastname}, your profile with ${email} was created `})
        } else{
            // res.json({
            //     msg: "User Already Exist",
            //     success: false
            // })
            throw new Error('User Already Exists')

        }

    } catch (error) {
        res.status(500).json({ error : error.message});
        
    }
})

// export const register = async (req, res) => {
//     const {firstname, lastname, email, mobile, password} = req.body;
//     if (!email) return res.status(400).json({'message': 'please fill in the email'});
//     //check if there is duplicate email
//     const duplicateEmail = await userModel.findOne({email: email}).exec();
//     if(duplicateEmail) return res.status(409).json({'message':"there is a another user using the email"}); // conflice
//     try {
//         const salt = await bcrypt.genSalt();
//         const hashedPwd = await bcrypt.hash(password, salt);
//         const result = await userModel.create({
//             "firstname": firstname,
//             "lastname":lastname,
//             "email":email,
//             "mobile":mobile,
//             "password": password
//         })
//         console.log(result)
//         res.status(201).json({ 'success': `${lastname} your profile has been created`})
//     } catch(err){
//         res.status(500).json({ 'message':err.message})
//     }
// }

/**Login */

export const Login = asyncHandler( async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) return res.status(400).json({"message": 'Username and password required'})
        const registeredUser = await userModel.findOne({email : email}).exec();
        if(registeredUser){
            const checkPassword = await bcrypt.compare(password, registeredUser.password);
            if(checkPassword){
                // Now getting the roles for each user
                const roles = Object.values(registeredUser.roles)
                //create JWTS
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "userid": registeredUser?._id,
                            "roles": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1m'}
                )

                const refreshToken = await generateRefreshToken(registeredUser?._id)
                // then we save the refreshToken in the database
                registeredUser.refreshToken = refreshToken;
                const result = await registeredUser.save();
                // console.log(result)

                // res.cookie('jwt', refreshToken, { httpOnly : true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60* 1000} )
                res.cookie('refreshToken', refreshToken, { httpOnly : true, maxAge: 24 * 60 * 60* 1000} )
            
                return res.status(201).json({'message': "you are logged", 
                                             'Accesstoken':accessToken})
            } else {
                return res.json("invalid email or password")
            }
        }
        else{
            // return res.status(404).json({'message':'user does not exist'})
            return res.sendStatus(401)
        }

        
    } catch (error) {
        res.status(500).json({ error : error.message});
        
    }
})


export const forgetPassword = asyncHandler( async (req, res) => {
    //find the id from the user through authmiddleware
    const {_id} = req.user;
    const {password} = req.body;
    //we find if the id with user truly exist
    validateDBid(_id);
    if(password){
        try {
            const user = await userModel.findById(_id);
            //encrypt the password
            const newSalt = await bcrypt.genSaltSync(10);
            const newPassword = await bcrypt.hash(password, newSalt);
            //we save the new passwoed
            user.password = newPassword;
            const updatedPassword = await user.save();
            // return the res
            res.json(updatedPassword)
            
        } catch (error) {
            throw new Error
            
        }
    }else{
        res.jsos({"message": "type a valid password"})
    }


})

export const resetPassword = asyncHandler( async (req, res) => {
    //first we need the email
    const {email} = req.body;
    // then we find the user if it exist
    const user = await userModel.findOne({ email });
    if(!user) throw new Error('User not found with this email');
    try {
        //first we create a token
        const token = await user.createPasswordResetToken();
        await user.save();
        
        //then we create a URLReset
        const resetUrl = `Hi, please follow this link to reset your password. this link is valid till 10min from now, <a href='http://localhost:5000/api/reset-password/${token}'> Click Here</a>`
        const date = {
            to: email,
            text: "Hey User",
            subject: "forgot password link",
            html: resetUrl,
        };
        sendEmail(data);
        res.json(token)
        
    } catch (error) {
        throw new Error(error)
    }


})

export const resetPasswordToken = asyncHandler(async (req, res) => {
    const { password } = req.body;
    //hashed the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const { token } = req.params;
    // then we hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex")
    // then we find the user from db
    const user = await userModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt : Date.now()}
    })
    if(!user) throw new Error(" Token Expired, please try again later");
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user)
})