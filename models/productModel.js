import mongoose from "mongoose"

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        
    },
    Slug:{
        type:String,
        required:true,
        
    },
    description:{
        type: String,
        required:true,
        
    },
    Price:{
        type:Number,
        required:true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    brand: {
        type: String,
        enum : ["Apple", "Samsung", "Lenovo"]
    },
    quantity: Number,
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        enum: ["Black", "Brown", "Red"],
    },
    ratings: {
        star: Number,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    }


}, {timestamps: true})

// //Export the model
// module.exports = mongoose.model('Product', productSchema);
const productModel = mongoose.model('Product', userSchema);

export default productModel