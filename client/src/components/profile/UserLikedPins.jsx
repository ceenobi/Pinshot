import PropTypes from "prop-types";
import { useFetch } from "../../hooks";
import { pinService } from "../../services";
import { Loading } from "../../utils";
import MasonryLayout from "../MasonryLayout";
import PinCard from "../PinCard";

const UserLikedPins = ({ user }) => {
  const { data, error, loading } = useFetch(
    pinService.getPinsLikedByUser,
    user._id
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

UserLikedPins.propTypes = {
  user: PropTypes.string,
};
