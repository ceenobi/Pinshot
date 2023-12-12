import { MasonryLayout, PageLayout, PinCard } from "../components";
import { useFetch, useTitle } from "../hooks";
import { pinService } from "../services";
import { Loading } from "../utils";

const Home = () => {
  const { error, loading, data } = useFetch(pinService.getAllPins);
  useTitle("Pinshot Home");

  return (
    <PageLayout extra="px-3" style={{paddingTop:'8rem'}}>
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Fetching pins..." />
          ) : (
            <MasonryLayout>
              {data?.pins?.map((pin) => (
                <PinCard key={pin._id} {...pin} />
              ))}
            </MasonryLayout>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Home;
