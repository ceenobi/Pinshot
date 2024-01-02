import PropTypes from "prop-types";
import { Col, Image, Row } from "react-bootstrap";
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
    <div>
      <div className="mt-5">
        {error ? (
          <p className="mt-5">{error}</p>
        ) : (
          <>
            {loading ? (
              <Loading text="Fetching pins..." />
            ) : (
              <>
                {followers?.length > 0 ? (
                  <Row className="g-3">
                    {followers.map((follower) => (
                      <Col key={follower._id} xs={6} md={2}>
                        <div
                          style={{ width: "50px", height: "50px" }}
                          className="mx-auto"
                        >
                          <Link to={`/profile/${follower.userName}`}>
                            <Image
                              src={follower.profilePhoto}
                              className="w-100 h-100 object-fit-cover"
                              roundedCircle
                              alt={follower.userName}
                            />
                          </Link>
                        </div>
                        <p className="text-center">
                          {follower.userName}
                        </p>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p>No followers yet.</p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubscribedUsers;

SubscribedUsers.propTypes = {
  userId: PropTypes.string,
};
