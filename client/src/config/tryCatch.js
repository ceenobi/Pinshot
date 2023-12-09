import toast from "react-hot-toast";

const tryCatch = (fn) => {
  return async (param) => {
    try {
      await fn(param);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.error);
    }
  };
};

export default tryCatch;
