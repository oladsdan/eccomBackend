import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY
})

export const cloudinaryUploadImg = async (fileToUplods) => {
    return new Promise((resolve) => {
        cloudinary.UploadStream.upload(fileToUplods, (result) => {
            resolve({
                url: result.secure_url,
            },{
                resource_type: "auto"
            })
        })
    })
}