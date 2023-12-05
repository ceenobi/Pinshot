import { MasonryLayout, PageLayout, PinCard } from "../components";
import { useFetch } from "../hooks";
import { pinService } from "../services";
import { Loading } from "../utils";

const Home = () => {
  const { error, loading, data } = useFetch(pinService.getAllPins);
  return (
    <PageLayout extra="py-5 px-3 mt-5">
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
