import { useEffect, useState } from "react";

const useFetch = (api, params) => {
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
        const res = await api(params, { signal });
        setData(res?.data);
      } catch (error) {
        console.error(error);
        setError(error?.message || error?.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
    return () => {
      controller.abort();
    };
  }, [api, params]);

  return { data, loading, error, setData };
};

export default useFetch;
