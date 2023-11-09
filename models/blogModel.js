import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type:Boolean,
        default:false
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    image: {
        type: Array,
        default: "https://www.shutterstock.com/image-photo/bloggingblog-concepts-ideas-white-worktable-600w-1029506242.jpg"
    },
    author: {
        type: String,
        default: "Admin"
    }
},{
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true
});

//Export the model
const blogModel = mongoose.model('Blog', blogSchema);
export default blogModel