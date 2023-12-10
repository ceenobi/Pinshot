import { useFetch } from "../../hooks";
import { pinService } from "../../services";
import { Loading } from "../../utils";
import MasonryLayout from "../MasonryLayout";
import PinCard from "../PinCard";

const UserLikedPins = () => {
  const { data, error, loading } = useFetch(pinService.getPinsLikedByUser);

  return (
    <div className="mt-5">
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Fetching liked pins..." />
          ) : (
            <MasonryLayout>
              {data?.pins?.map((pin) => (
                <PinCard key={pin._id} {...pin} />
              ))}
            </MasonryLayout>
          )}
        </>
      )}
    </div>
  );
};

export default UserLikedPins;
