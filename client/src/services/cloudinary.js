import axios from "axios";
import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_UPLOAD_URL,
} from "../config/connect";
import toast from "react-hot-toast";

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  [...file].forEach((file, i) => {
    formData.append(`file-${i}`, file, file.name);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  });
  // formData.append("file", file);
  try {
    const data = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent.progress * 100),
          {
            headers: {
              "Custom-Header": "value",
            },
          };
      },
    });
    toast.success("Image upload succssfull");
    return data;
  } catch (error) {
    toast.error("There was an error uploading your image");
    console.error(error);
  }
};
