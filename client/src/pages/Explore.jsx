import { useState } from "react";
import { MasonryLayout, PinCard } from "@components";
import { useFetch, useTitle } from "@hooks";
import { PageLayout } from "@layouts";
import { pinService } from "@services";
import { Loading, ReactInfiniteScroll } from "@utils";

const Explore = () => {
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [moreData, setMoreData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { pagedData, loading } = useFetch(
    pinService.getExplorePins,
    currentPage
  );
  useTitle("Explore pins");

  const fetchMoreData = async () => {
    if (pagedData.length < 20) {
      setHasMore(false);
      return;
    }
    try {
      setMoreData((prevMoreData) => [...prevMoreData, ...pagedData]);
      setHasMore(moreData.length > 0);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  const allPins = [...moreData, ...pagedData];

  return (
    <PageLayout extra="px-3" style={{ paddingTop: "8rem" }}>
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading && <Loading text="Fetching pins..." />}
          {allPins?.length > 0 ? (
            <ReactInfiniteScroll
              dataLength={allPins?.length}
              next={fetchMoreData}
              hasMore={hasMore}
            >
              <MasonryLayout>
                {allPins.map((pin, index) => (
                  <PinCard key={index} {...pin} />
                ))}
              </MasonryLayout>
            </ReactInfiniteScroll>
          ) : (
            <p className="mt-5">No pins to show at the moment.</p>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Explore;
