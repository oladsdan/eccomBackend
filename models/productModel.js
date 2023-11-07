import mongoose from "mongoose"

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        
    },
    slug:{
        type:String,
        required:true,
        
    },
    description:{
        type: String,
        required:true,
        
    },
    price:{
        type:Number,
        required:true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        required: true,
    },
    ratings: {
        type: Array,
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        // default: 0
    },
    totalrating:{
        type: Number,
        default: 0,
    }


}, {timestamps: true})

// //Export the model
// module.exports = mongoose.model('Product', productSchema);
const productModel = mongoose.model('Product', productSchema);

export default productModel