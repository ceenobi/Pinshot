import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useFetch = (api, params, extra) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null || "");

  useEffect(() => {
    if (!api) {
      setError("API is not provided");
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchdata = async () => {
      try {
        setLoading(true);
        const res = await api(params, extra, { signal });
        setData(res?.data);
      } catch (error) {
        console.error(error);
        setError(error?.message);
        toast.error(error?.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
    return () => {
      controller.abort();
    };
  }, [api, params, extra]);

  return { data, loading, error, setData };
};

export default useFetch;
