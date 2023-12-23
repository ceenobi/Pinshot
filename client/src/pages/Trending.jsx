import { useState } from "react";
import { MasonryLayout, PageLayout, PinCard } from "../components";
import { useFetch, useTitle } from "../hooks";
import { pinService } from "../services";
import { Loading, ReactInfiniteScroll } from "../utils";

const Trending = () => {
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { loading, data, setData } = useFetch(pinService.getAllPins);
  useTitle("Trending");

  const fetchData = async () => {
    try {
      const res = await pinService.getAllPins(currentPage);
      setData((prevItems) => {
        // Combine previous and new items
        const allItems = [...prevItems, ...res.data.pins];
        // Filter out duplicates based on a unique identifier, for example, 'id'
        const uniqueItems = allItems.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t._id === item._id)
        );
        return uniqueItems;
      });
      // Check if new data is received and update hasMore accordingly
      res.data.pins?.length > 0 ? setHasMore(true) : setHasMore(false);
      // Increment the current page for the next fetch
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <PageLayout extra="px-3" style={{ paddingTop: "8rem" }}>
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Fetching pins..." />
          ) : (
            <ReactInfiniteScroll
              dataLength={data.length}
              fetchMoreData={fetchData}
              hasMore={hasMore}
            >
              <MasonryLayout>
                {data?.map((pin) => (
                  <PinCard key={pin._id} {...pin} />
                ))}
              </MasonryLayout>
            </ReactInfiniteScroll>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Trending;
