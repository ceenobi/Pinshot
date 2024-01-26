import PropTypes from "prop-types";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFetch } from "@hooks";
import { userService } from "@services";
import { Loading } from "@utils";

const SubscribedUsers = ({ userId }) => {
  const {
    data: followers,
    error,
    loading,
  } = useFetch(userService.getSubscribedUsers, userId);

  return (
    <div className="mt-5">
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Fetching users..." />
          ) : (
            <>
              {followers?.length > 0 ? (
                <div className="d-flex flex-wrap gap-3">
                  {followers.map((follower) => (
                    <Link
                      to={`/profile/${follower.userName}`}
                      className="mb-2 p-2 hovershade text-center"
                      key={follower._id}
                    >
                      <Image
                        className="rounded-4 object-fit-cover mb-2"
                        src={follower.profilePhoto}
                        alt={follower.userName}
                        loading="lazy"
                        style={{
                          width: "50px",
                          height: "50px",
                        }}
                        roundedCircle
                      />
                      <p
                        to={`/profile/${follower.userName}`}
                        className="fw-bold small"
                      >
                        {follower.userName}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>No followers yet.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SubscribedUsers;

SubscribedUsers.propTypes = {
  userId: PropTypes.string,
};
