import { MasonryLayout, PageLayout, PinCard } from "../components";
import { useFetch, useTitle } from "../hooks";
import { pinService } from "../services";
import { Loading } from "../utils";

const Home = () => {
  const { error, loading, data } = useFetch(pinService.getSubscribedPins);
  useTitle("Pinshot Home");

  return (
    <PageLayout extra="px-3" style={{ paddingTop: "8rem" }}>
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Fetching pins..." />
          ) : (
            <>
              {data?.pins?.length > 0 ? (
                <MasonryLayout>
                  {data?.pins?.map((pin) => (
                    <PinCard key={pin._id} {...pin} />
                  ))}
                </MasonryLayout>
              ) : (
                <p className="mt-5">
                  No pins to show. You are not following anyone yet. View a pin
                  to follow a user.
                </p>
              )}
            </>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Home;
