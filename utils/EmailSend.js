import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";

const sendEmail = asyncHandler( async(data, req, res)=>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_ID, //generated ethereal user
            pass: process.env.MP, // generated ehthereal password
        }
    })
        
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Hey " <foo@gmail.com>', //sender address
        to: data.to, // list of receivers
        subject: data.subject, // subjecte line
        text: data.text, // plain text body
        html: data.html // html body

    });

    console.log("Message sent: %s", info.messageId);
    
    //Preview only avialable when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
})

export default sendEmail