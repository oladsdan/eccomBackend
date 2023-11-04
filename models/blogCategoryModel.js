import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var BlogcategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
   
},{timestamps: true});

//Export the model
const blogCategoryModel = mongoose.model('BlogCategory', BlogcategorySchema);
export default blogCategoryModel