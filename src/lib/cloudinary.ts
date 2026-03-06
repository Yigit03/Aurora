import {v2 as cloudinary } from 'cloudinary';

//Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Tip tanımları
interface CloudinaryImage{
    public_id:string;
    format:string;
    created_at:string;
    secure_url:string;
    width?:string;
    height?:string;
}

//upload process
export const uploadImage = async (file:string, folder:string ='uploads') => {
    const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type:'auto',
    })

    return{
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
    }
};

// Delete process
export const deleteImage = async (publicId: string) => {
    const result = await cloudinary.uploader.destroy(publicId)
    return result // ok veya not found döner.
};

//Update (sil yenisini yükle)
export const updateImage = async (oldPublicId: string, newFile:string, folder:string = 'uploads'): Promise<string> => {
    await deleteImage(oldPublicId);
    const result = await updateImage(newFile, folder)
    return result
};

//List process (all images)
export const listImage = async (folder:string = "uploads") =>{
    const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: 100,
    })

    return result.resources.map((img:CloudinaryImage) => ({
        url: img.secure_url,
        publicId: img.public_id,
        format: img.format,
        createdAt: img.created_at,
    }))
};

export default cloudinary;