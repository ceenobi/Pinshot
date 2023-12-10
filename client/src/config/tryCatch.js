import toast from "react-hot-toast";

const tryCatch = (fn) => async (param) => {
  try {
    await fn(param);
  } catch (error) {
    console.error(error);
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("An error occurred");
    }
  }
};

export default tryCatch;
