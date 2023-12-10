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
  } = useFetch(userService.getSubscribedUsers, user._id);

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
                {followers && followers?.length > 0 ? (
                  <Row className="g-3">
                    {followers?.map((follow) => (
                      <Col key={follow._id} xs={2} md={2}>
                        <div>
                          <div style={{ width: "100px", height: "100px" }}>
                            <Link to={`/profile/${follow.userName}`}>
                              <Image
                                src={follow.profilePhoto}
                                className="w-100 h-100 object-fit-cover"
                                roundedCircle
                                alt={follow.userName}
                              />
                            </Link>
                            <p className="text-center">{follow.userName}</p>
                          </div>
                        </div>
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
