import userModel from "../models/userModet.js"
import bcrypt from 'bcrypt';
import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import generateRefreshToken from "../config/refreshToken.js";
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

                const refreshToken = generateRefreshToken(registeredUser?._id)
                // then we save the refreshToken in the database
                registeredUser.refreshToken = refreshToken;
                const result = await registeredUser.save();

                res.cookie('jwt', refreshToken, { httpOnly : true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60* 1000} )
            
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