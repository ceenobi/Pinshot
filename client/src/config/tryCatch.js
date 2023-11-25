import toast from "react-hot-toast";

const tryCatch = (fn) => {
  return async (res) => {
    try {
      await fn(res);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error);
    }
  };
};

export default tryCatch;
