import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { pinService } from "../services";
import { MasonryLayout, PageLayout, PinCard } from "../components";
import { Loading } from "../utils";

const Search = () => {
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const searchRequest = async () => {
        document.title = `Search result for "${query}"`;
        try {
          setLoading(true);
          const { data } = await pinService.searchPins(query);
          setResult(data);
        } catch (error) {
          setError(error);
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      searchRequest();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  console.log(result);

  return (
    <PageLayout extra="py-5 px-3 mt-4 mt-lg-5">
      {error ? (
        <p className="mt-5">{error?.response?.data?.error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Searching pins..." />
          ) : (
            <div>
              {result?.length > 0 ? (
                <MasonryLayout>
                  {result.map((pin) => (
                    <PinCard key={pin._id} {...pin} />
                  ))}
                </MasonryLayout>
              ) : (
                <p className="fs-6 mt-5">
                  Sorry we could not find any available pin for{" "}
                  <span className="fw-bold">
                    &quot;{query}
                    &quot;
                  </span>
                </p>
              )}
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Search;
