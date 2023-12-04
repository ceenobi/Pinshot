import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
});

console.log(cloudinary.config());

const options = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
};

export const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, options);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error.message);
  }
};
