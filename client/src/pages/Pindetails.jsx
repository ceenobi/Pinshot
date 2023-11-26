import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useFetch } from "../hooks";
import { pinService } from "../services";
import { Comments, MyButton, PageLayout } from "../components";
import { Col, Image, Row } from "react-bootstrap";
import { useState } from "react";
import { Loading, downloadImage } from "../utils";
import { useStateContext } from "../config";
import toast from "react-hot-toast";

const Pindetails = () => {
  const { pinId } = useParams();
  const [current, setCurrent] = useState(0);
  const {
    error,
    loading,
    data: pin,
    setData,
  } = useFetch(pinService.getAPin, pinId);
  const { loggedInUser } = useStateContext();

  const imgLength = pin?.image?.length;

  const nextSlide = () => {
    setCurrent(current === imgLength - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? imgLength - 1 : current - 1);
  };

  const handleLike = async () => {
    try {
      const res = await pinService.likeAPin(pinId, loggedInUser._id);
      toast.success(res.data);
      const pins = await pinService.getAPin(pinId);
      setData(pins.data);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  const handleDislike = async () => {
    try {
      const res = await pinService.dislikeAPin(pinId, loggedInUser._id);
      toast.success(res.data);
      const pins = await pinService.getAPin(pinId);
      setData(pins.data);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <PageLayout extra="py-5 px-3 mt-4 mt-lg-5">
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Fetching pin..." />
          ) : (
            <Row className="g-3">
              <Col lg={6} className="mb-4">
                <div className="w-100 h-75">
                  {pin?.image?.map((img, i) => (
                    <div key={i} className="position-relative pinId-Img">
                      {i === current && (
                        <>
                          <Image
                            src={img}
                            alt={pin.title}
                            className="rounded-4 w-100 h-100 object-fit-fill"
                          />
                          <div className="focus-arrowBox">
                            <Icon
                              icon="mdi:arrow-left-bold-circle-outline"
                              className="cursor fs-2 arrowLeft activeIcon"
                              onClick={prevSlide}
                            />
                            <Icon
                              icon="mdi:arrow-right-bold-circle-outline"
                              className="cursor fs-2 arrowRight activeIcon"
                              onClick={nextSlide}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </Col>
              <Col lg={6} className="mb-4 px-lg-4">
                <h1 className="fw-bold display-6 mb-4">{pin.title}</h1>
                <p className="mb-4">{pin.description}</p>
                <div className="mb-4 d-flex gap-2 justify-content- w-100">
                  <div>
                    {pin?.image?.map((img, i) => (
                      <div key={i} title="download this image">
                        {i === current && (
                          <Icon
                            icon="material-symbols:download-2-outline"
                            className="fs-3 cursor text-secondary activeIcon "
                            onClick={() => downloadImage(pin._id, img)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div
                    className="d-flex align-items-center gap-2"
                    title={
                      pin.likes?.includes(loggedInUser._id)
                        ? "You liked this"
                        : "Like this pin"
                    }
                  >
                    <Icon
                      icon="mdi:cards-heart"
                      className={`fs-3 cursor ${
                        pin.likes?.includes(loggedInUser._id)
                          ? "text-danger"
                          : "text-secondary activeIcon "
                      }`}
                      onClick={
                        pin.likes?.includes(loggedInUser._id)
                          ? handleDislike
                          : handleLike
                      }
                    />
                    <span>{pin.likes?.length} likes</span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center gap-2 flex-grow-1">
                    <Link to={`/profile/${pin.owner}`}>
                      <Image
                        src={pin.avatar}
                        roundedCircle
                        style={{ width: "45px", height: "45px" }}
                        alt={pin.owner}
                      />
                    </Link>
                    <div>
                      <Link
                        to={`/profile/${pin.owner}`}
                        className="fs-6 fw-bold"
                        style={{ color: "var(--dark100)" }}
                      >
                        {pin.owner}
                      </Link>
                      <div>{pin.userId?.subscribedUsers?.length} followers</div>
                    </div>
                  </div>
                  {loggedInUser._id !== pin.userId && (
                    <MyButton
                      text={
                        loggedInUser.subscribedUsers?.includes(pin.userId)
                          ? "Unfollow"
                          : "Follow"
                      }
                      className="border-0 fw-bold"
                      style={{ backgroundColor: "var(--blue100)" }}
                    />
                  )}
                </div>
                <Comments pinId={pinId} />
              </Col>
            </Row>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Pindetails;
