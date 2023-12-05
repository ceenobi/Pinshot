import PropTypes from "prop-types";
import { useFetch } from "../hooks";
import { pinService } from "../services";
import { Loading } from "../utils";
import MasonryLayout from "./MasonryLayout";
import PinCard from "./PinCard";

const UserPins = ({ user }) => {
  const { data, error, loading } = useFetch(pinService.getPinsByUser, user._id);

  return (
    <div>
      <h1 className="fs-5 text-center mb-5">Created pins</h1>
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
    </div>
  );
};

export default UserPins;

UserPins.propTypes = {
  user: PropTypes.object,
};
