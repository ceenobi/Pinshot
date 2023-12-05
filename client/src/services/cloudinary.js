import axios from "axios";
import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_UPLOAD_URL,
} from "../config/connect";
import toast from "react-hot-toast";

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  // for (let i = 0; i < file.length; i++) {
  //   formData.append("file", file[i]);
  //   formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  // }
  [...file].forEach((file, i) => {
    formData.append("file", file, file[i]);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  });
  try {
    const data = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
    toast.success("Image upload successfull");
    return data;
  } catch (error) {
    toast.error("There was an error uploading your image");
    console.error(error);
  }
};
