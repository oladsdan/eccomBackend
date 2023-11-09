import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import productRoutes from './routes/productRoutes.js'
import morgan from "morgan";
import blogRoutes from './routes/blogRoutes.js';
import productCategoryRoutes from './routes/productCategoryRoutes.js';
import blogCategoryRoutes from './routes/blogCategoryRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import couponRoutes from './routes/couponRoutes.js';



dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();


//built in middleware to enable urlencoded data
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: false}))
app.use(cookieParser());

//built-in middleware for json
app.use(express.json())

// app.use('/', (req, res) => {
//     res.send("Welcome to Server")
// })

app.use('/api', authRoutes)
app.use('/users', userRoutes)
// api for products
app.use('/api/product', productRoutes)

//blogs
app.use('/api/blog', blogRoutes)

//category routes
app.use('/api/category', productCategoryRoutes)
app.use('/api/blog-category', blogCategoryRoutes)
app.use('/api/brand', brandRoutes)
app.use('/api/coupon', couponRoutes)
//middleware




//custom error
app.use(notFound);
app.use(errorHandler);

mongoose.connect(process.env.MONGO_Url_Connect, {
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`server port: ${`server port: ${PORT} and connected to mongoCluster`}`))
}).catch((error) => console.log(`${error} did not connect`))

mongoose.connection.on("disconnected", () => {
    console.log("mongo disconnected")
})

mongoose.connection.on("connected", () => {
    console.log("mongo connected")
} )