import mongoose from "mongoose";
import crypto from "crypto";

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
    },
    //models for reseting passwords
    passwordChangedAt : Date,
    passwordResetToken: String,
    passwordResetExpires: Date

}, {timestamps: true});

//** another way to encrypt password using bcrypt in the model schema*/
// userSchema.pre("save", async function(next){
//     const salt = await bcrypt.genSaltSync(10);
//     this.password = await bcrypt.hash(this.password, salt);
// })

//comparing the password
// userSchema.methods.isPasswordMatched = async function(enterPassword) {
//     return await bcrypt.compare(enterPassword, this.password)
// }

//method for creating Password Reset Token
userSchema.methods.createPasswordResetToken = async () => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() * 30 * 60 *1000; // 10 minutes
}

//Export the model 
const userModel = mongoose.model('User', userSchema);
export default userModel