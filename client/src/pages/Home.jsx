import { useState } from "react";
import { MasonryLayout, PageLayout, PinCard } from "../components";
import { useFetch, useTitle } from "../hooks";
import { pinService } from "../services";
import { Loading, ReactInfiniteScroll } from "../utils";

const Home = () => {
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [moreData, setMoreData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { pagedData, loading } = useFetch(
    pinService.getSubscribedPins,
    currentPage
  );
  useTitle("Pinshot Home");

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

  return (
    <PageLayout extra="px-3" style={{ paddingTop: "8rem" }}>
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
                {[...moreData, ...pagedData].map((pin) => (
                  <PinCard key={pin._id} {...pin} />
                ))}
              </MasonryLayout>
            </ReactInfiniteScroll>
          ) : (
            <p className="mt-5">
              No pins to show. You are not following anyone yet. View a pin to
              follow a user.
            </p>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Home;
