import PropTypes from "prop-types";
import { useFetch } from "../../hooks";
import { pinService } from "../../services";
import { Loading } from "../../utils";
// import MasonryLayout from "../MasonryLayout";
import PinCard from "../PinCard";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

const UserPins = ({ user }) => {
  const { data, error, loading } = useFetch(pinService.getPinsByUser, user._id);

  return (
    <div className="mt-5">
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Fetching pins..." />
          ) : (
            <Row className="g-3">
              {data?.pins?.map((pin) => (
                <Col key={pin._id} xs={6} md={3}>
                  <div className="cardBx w-100 h-100 rounded-4">
                    <Link to={`/pin/${pin._id}`}>
                      <LazyLoadImage
                        alt={pin.title}
                        effect="blur"
                        src={pin.image[0]}
                        className="rounded-4 object-fit-cover"
                        width={"100%"}
                        height={"100%"}
                      />
                    </Link>
                  </div>
                </Col>
              ))}
            </Row>
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
