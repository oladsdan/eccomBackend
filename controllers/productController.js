import productModel from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import userModel from "../models/userModet.js";

export const createProduct = asyncHandler( async (req, res) => {
    const product = req.body
    try {
        if(product?.title){
            product.slug = slugify(product.title)
        }
        const newProducts = new productModel(product)
        const productsCreated = await newProducts.save()
        res.status(201).json({productsCreated})
        
        
    } catch (error) {
        throw new Error (error)        
        
    }
})

// update product
export const updateProduct = asyncHandler (async (req, res) => {
    const {id} = req.params;
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await productModel.findByIdAndUpdate(id, req.body, {new:true})
        if(!updateProduct) return res.status(404).json("no valid product")
        res.json(updateProduct)
        
    } catch (error) {
        throw new Error(error)
        
    }
})

//delete product
export const deleteProduct = asyncHandler (async (req, res) => {
    const {id} = req.params;
    try {
        if(!id){
            return res.json("there is know id found")
        } else {
            const deletedProduct = await productModel.findByIdAndDelete(id)
            res.json({"message": `this user with ${id} has been deleted or does not exist`})
        }
            

    } catch (error) {
        throw new Error(error)
    }
})

//GETTING A PRODUCT
export const getSingleProduct = asyncHandler( async (req, res) => {
    const {id} = req.params;
    try {
        const productComponent = await productModel.findById(id);
        if(!productComponent)
            return res.status(404)
        res.json(productComponent)
        
    } catch (error) {
        throw new Error (error)
    }
})

// export const getAllProduct = asyncHandler(async (req, res) => {
//     console.log(req.query)
//     try {
//         const getAllProducts = await productModel.find()
//         res.json(getAllProducts)
//     } catch (error) {
//         throw new Error (error)
        
//     }
// })


//getting all product and also for filtering
export const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // console.log(JSON.parse(queryStr))

        let query = productModel.find(JSON.parse(queryStr))

        // Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt")
        }

        //limiting the fields
        if(req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        //pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1)*limit;
        query = query.skip(skip).limit(limit)

        if (req.query.page){
            const productCount = await productModel.countDocuments();
            if(skip >= productCount) throw new Error("This Page does not exist") 
        }

        const getAllProducts = await query
        res.json(getAllProducts)
    } catch (error) {
        throw new Error (error)
        
    }
})

export const addToWishList = asyncHandler (async (req, res) => {
    //first we deconstruct the id from body
    const {_id} = req.user;
    const { prodId} = req.body;
    try{
        const user = await userModel.findById(_id);
        // then we check if the user already has a wishlist id
        const wishlistAdded = user?.wishlist.find((id) => id.toString() === prodId.toString())
        if (wishlistAdded){
            let user = await userModel.findByIdAndUpdate(_id, {
                $pull: { wishlist : prodId}
            }, {new: true})
            res.json(user);
 
        }else {
            let user = await userModel.findByIdAndUpdate(_id, {
                $push: { wishlist : prodId}
            }, {new: true})
            res.json(user);

        }
    } catch (error){
        throw new Error(error)
    } 
    
})

export const rating = asyncHandler (async (req, res) => {
    const {_id} = req.user;
    const {star, prodId, comment} = req.body;
    
    try {
        const product = await productModel.findById(prodId);
        console.log(product)
        let alreadyRated = await product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        )
        if (alreadyRated) {
            const updateRating = await productModel.updateOne({
                ratings: {$elemMatch: alreadyRated},
            },
            {
                $set: { "ratings.$.star": star, "ratings.$.comment": comment},
            }, {new:true})
            // res.json(updateRating)
            // console.log(updateRating)


        } else {
            const rateProduct = await productModel.findByIdAndUpdate(prodId, {
                $push: {
                    ratings: {
                        star: star,
                        comment:comment,
                        postedby: _id
                    }
                }
            }, {new: true})
            // res.json(rateProduct)
            // console.log(rateProduct)
        }

        // getting Total Ratings
        const getallratings = await productModel.findById(prodId);
        let totalRating = getallratings.ratings.length;
        // console.log(totalRating);
        let ratingSum = getallratings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingSum/ totalRating);
        // console.log(actualRating);
        let finalProduct = await productModel.findByIdAndUpdate(prodId, {
            totalrating : actualRating
        }, {new: true})
        res.json(finalProduct)
    } catch (error) {
        throw new Error(error)
        
    }

})