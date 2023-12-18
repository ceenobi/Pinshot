import PropTypes from "prop-types";
import { useFetch } from "../../hooks";
import { userService } from "../../services";
import { Loading } from "../../utils";
import { Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const SubscribedUsers = ({ user }) => {
  const {
    data: followers,
    error,
    loading,
  } = useFetch(userService.getSubscribedUsers, user?._id);

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
                          style={{ width: "80px", height: "80px" }}
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
                        <p className="text-center text-black">
                          {follower.userName}
                        </p>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p>You have no followers yet.</p>
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
  user: PropTypes.object,
};
