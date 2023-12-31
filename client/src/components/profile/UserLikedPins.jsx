import PropTypes from "prop-types";
import { useFetch } from "@hooks";
import { pinService } from "@services";
import { Loading } from "@utils";
import MasonryLayout from "../MasonryLayout";
import PinCard from "../PinCard";

const UserLikedPins = ({ userId }) => {
  const { data, error, loading } = useFetch(
    pinService.getPinsLikedByUser,
    userId
  );

  return (
    <div className="mt-5">
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Fetching liked pins..." />
          ) : (
            <>
              {data?.pins?.length > 0 ? (
                <MasonryLayout>
                  {data?.pins?.map((pin) => (
                    <PinCard key={pin._id} {...pin} />
                  ))}
                </MasonryLayout>
              ) : (
                <p>No liked pins yet.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserLikedPins;

UserLikedPins.propTypes = {
  userId: PropTypes.string,
};
