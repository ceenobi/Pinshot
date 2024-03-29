import PropTypes from "prop-types";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFetch } from "@hooks";
import { userService } from "@services";
import { Loading } from "@utils";

const SubscribedUsers = ({ userId }) => {
  const {
    data: following,
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
              {following?.length > 0 ? (
                <div className="d-flex flex-wrap gap-3">
                  {following.map((followed) => (
                    <Link
                      to={`/profile/${followed.userName}`}
                      className="mb-2 p-2 hovershade text-center"
                      key={followed._id}
                    >
                      <Image
                        className="rounded-4 object-fit-cover mb-2"
                        src={followed.profilePhoto}
                        alt={followed.userName}
                        loading="lazy"
                        style={{
                          width: "50px",
                          height: "50px",
                        }}
                        roundedCircle
                      />
                      <p
                        to={`/profile/${followed.userName}`}
                        className="fw-bold small"
                      >
                        {followed.userName}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>Not following anyone yet.</p>
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
