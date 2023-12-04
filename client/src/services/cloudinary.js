import axios from "axios";
import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_UPLOAD_URL,
} from "../config/connect";
// import { tryCatch } from "../config";
import toast from "react-hot-toast";
// import { useState } from "react";

export const uploadToCloudinary = async (file) => {
  // const [progress, setProgress] = useState({ started: false, pc: 0 });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  try {
    // setProgress(prevState => {
    //   return {...prevState, started: true}
    // })
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
