import { MasonryLayout, PageLayout, PinCard } from "../components";
import { useFetch } from "../hooks";
import { pinService } from "../services";
import { Loading } from "../utils";

const Following = () => {
  const { error, loading, data } = useFetch(pinService.getSubscribedPins);

  return (
    <div>
      <PageLayout extra="py-5 px-3 mt-5">
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
                    No pins to show. You are not following anyone yet. View a
                    pin to follow a user.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </PageLayout>
    </div>
  );
};

export default Following;
