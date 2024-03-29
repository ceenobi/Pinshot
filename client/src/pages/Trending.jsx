import { useState } from "react";
import { MasonryLayout, PinCard } from "@components";
import { PageLayout } from "@layouts";
import { useFetch, useTitle } from "@hooks";
import { pinService } from "@services";
import { Loading, ReactInfiniteScroll } from "@utils";

const Trending = () => {
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [moreData, setMoreData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { pagedData, loading } = useFetch(pinService.getAllPins, currentPage);
  useTitle("Trending pins");

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

  // const fetchMoreData = async () => {
  //   if (pagedData.length < 20) {
  //     setHasMore(false);
  //     return;
  //   } else {
  //     try {
  //       const newData = await pinService.getAllPins(currentPage);
  //       setMoreData((prevMoreData) => [...prevMoreData, ...newData.data.pins]);
  //       setHasMore(newData.data.pins.length > 0);
  //       setCurrentPage((prevPage) => prevPage + 1);
  //     } catch (error) {
  //       setError(error.message);
  //       console.log(error);
  //     }
  //   }
  // };

  return (
    <PageLayout extra="px-3" style={{ paddingTop: "8.5rem" }}>
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading && <Loading text="Fetching pins..." />}
          {pagedData?.length > 0 ? (
            <ReactInfiniteScroll
              dataLength={pagedData.length}
              next={fetchMoreData}
              hasMore={hasMore}
            >
              <MasonryLayout>
                {[...moreData, ...pagedData].map((pin, index) => (
                  <PinCard key={index} {...pin} />
                ))}
              </MasonryLayout>
            </ReactInfiniteScroll>
          ) : (
            <p className="mt-5">Nothing yet.</p>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Trending;
