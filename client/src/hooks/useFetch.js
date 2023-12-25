import { useEffect, useState } from "react";

const useFetch = (service, params, extra) => {
  const [data, setData] = useState([]);
  const [pagedData, setPagedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchdata = async () => {
      setLoading(true);
      try {
        const res = await service(params, extra, { signal });
        if (!signal.aborted) {
          setData(res.data);
          setPagedData(res.data?.pins);
          setError(null);
        }
      } catch (error) {
        if (!signal.aborted) {
          setError(error?.response?.data?.error || error?.message);
        }
        console.error(error);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchdata();
    return () => {
      controller.abort();
    };
  }, [service, params, extra]);

  return { data, loading, error, setData, pagedData, setPagedData };
};

export default useFetch;
