import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        
    },
    lastname:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    roles: {
        User: {
            type: Number,
            default: 2023
        },
        Editor: Number,
        Admin: Number
    },
    cart: {
        type: Array,
        default: [],
    },
    address: [{type: mongoose.Schema.Types.ObjectId, ref: "Address"}],
    wishlist: [{type:mongoose.Schema.Types.ObjectId, ref:"Product"}],
    
    refreshToken: {
        type: String
    }

}, {timestamps: true});

//** another way to encrypt password using bcrypt */
// userSchema.pre("save", async function(next){
//     const salt = await bcrypt.genSaltSync(10);
//     this.password = await bcrypt.hash(this.password, salt);
// })

//comparing the password
// userSchema.methods.isPasswordMatched = async function(enterPassword) {
//     return await bcrypt.compare(enterPassword, this.password)
// }

//Export the model
const userModel = mongoose.model('User', userSchema);
export default userModel