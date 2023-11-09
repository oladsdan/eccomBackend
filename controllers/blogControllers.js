import blogModel from "../models/blogModel.js";
import userModel from "../models/userModet.js";
import asyncHandler from 'express-async-handler';
import validateDBid from "../utils/validateDBid.js";
import { cloudinaryUploadImg } from "../utils/cloudinary.js";
import fs from 'fs';

export const createBlog = asyncHandler(async (req, res) =>{
   try {
        const blog = await req.body;
        const newBlog = new blogModel(blog);
        await newBlog.save();
        res.status(201).json(newBlog)

    
   } catch (error) {
        throw new Error(error)
   }
})

export const updateBlog = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        //we find the id in the databse
        const updateBlogId = await blogModel.findByIdAndUpdate(id, req.body, {new: true});
        res.status(201).json(updateBlogId)

        
    } catch (error) {
        throw new Error(error)
        
    }
})

export const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await blogModel.find();
        res.json(getBlogs)
        
    } catch (error) {
        throw new Error(error)
        
    }
})
export const getABlog = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params
        validateDBid(id);

        const getBlogPost = await blogModel.findById(id).populate("likes").populate("dislikes");
        const updateViews = await blogModel.findByIdAndUpdate(id, {
            $inc: {numViews: 1},
        },{new: true})
        res.json(getBlogPost)

    } catch (error) {
        throw new Error(error)
        
    }
})

export const deleteBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateDBid(id);
    try {
        const deletedBlog = await blogModel.findByIdAndDelete(id);
        res.json(deletedBlog)
    } catch (error) {
        throw new Error(error)
        
    }
})

export const likeBlog = asyncHandler(async (req, res) => {
    const { blogId} = req.body;
    validateDBid(blogId);

    //find the blog which you want to be liked
    const blog = await blogModel.findById(blogId);
    const loginUserId= req?.user?._id;
    const isLiked = blog?.isLiked;
    // if the blog is already disliked by the user
    // const alreadyDisliked = blog?.dislikes?.find((userId = userId?.toString() === loginUserId?.toString()));
    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?._id.toString()===loginUserId.toString());
    if(alreadyDisliked){
        const blog = await blogModel.findByIdAndUpdate(blogId, {
            $pull: {dislikes: loginUserId},
            isDisliked: false
        }, {new: true})
        res.json(blog);
    }
    if(isLiked) {
        const blog = await blogModel.findByIdAndUpdate(blogId,{
            $pull: {likes: loginUserId},
            isLiked: false
        }, {new: true})
        res.json(blog);
    } else{
        const blog = await blogModel.findByIdAndUpdate(blogId,{
            $push: {likes: loginUserId},
            isLiked: true,
        }, {new: true})
        res.json(blog)
    }

})
export const disLikeBlog = asyncHandler(async (req, res) => {
    const { blogId} = req.body;
    validateDBid(blogId);

    //find the blog which you want to be liked
    const blog = await blogModel.findById(blogId);
    const loginUserId= req?.user?._id;
    const isDisLiked = blog?.isDisliked;
    // if the blog is already disliked by the user
    // const alreadyDisliked = blog?.dislikes?.find((userId = userId?.toString() === loginUserId?.toString()));
    const alreadyLiked = blog?.likes?.find((userId) => userId?._id.toString()===loginUserId.toString());
    if(alreadyLiked){
        const blog = await blogModel.findByIdAndUpdate(blogId, {
            $pull: {likes: loginUserId},
            isliked: false
        }, {new: true})
        res.json(blog);
    }
    if(isDisLiked) {
        const blog = await blogModel.findByIdAndUpdate(blogId,{
            $pull: {dislikes: loginUserId},
            isDisliked: false
        }, {new: true})
        res.json(blog);
    } else{
        const blog = await blogModel.findByIdAndUpdate(blogId,{
            $push: {dislikes: loginUserId},
            isDisliked: true,
        }, {new: true})
        res.json(blog)
    }

})

export const uploadImages = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateDBid(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for  (const file of files) {
            const {path} = file;
            const newPath = await uploader(path);
            urls.push(newPath) 
            fs.unlinkSync(path)
        }
        const findBlog = await blogModel.findByIdAndUpdate(id, 
            {images: urls.map((file) => {
                return file
        })},{new: true})
        res.json(findBlog) 
    } catch (error) {
        throw new Error(error)
    }
})

