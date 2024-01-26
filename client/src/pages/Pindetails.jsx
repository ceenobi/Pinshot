import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Col, Image, Row } from "react-bootstrap";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useFetch, useTitle, useCurentSlide } from "@hooks";
import { pinService, userService } from "@services";
import {
  Comments,
  EditPost,
  MasonryLayout,
  MyButton,
  PinCard,
  PinModal,
} from "@components";
import { PageLayout } from "@layouts";
import { Loading, downloadImage } from "@utils";
import { tryCatch, useAuthContext } from "@config";

const Pindetails = () => {
  const { pinId } = useParams();
  const {
    error,
    loading,
    data: pin,
    setData,
  } = useFetch(pinService.getAPin, pinId);
  const { data: relatedPins } = useFetch(pinService.getRelatedPins, pinId);
  const { loggedInUser, setLoggedInUser } = useAuthContext();
  const { prevSlide, nextSlide, current, setCurrent } = useCurentSlide(
    pin?.image?.length
  );
  // const [current, setCurrent] = useState(0);
  const [showPicModal, setShowPicModal] = useState(false);
  useTitle(pin?.title);

  const handleLike = tryCatch(async () => {
    const res = await pinService.likeAPin(pinId, loggedInUser._id);
    toast.success(res.data);
    const pin = await pinService.getAPin(pinId);
    setData(pin.data);
  });

  const handleDislike = tryCatch(async () => {
    const res = await pinService.dislikeAPin(pinId, loggedInUser._id);
    toast.success(res.data);
    const pin = await pinService.getAPin(pinId);
    setData(pin.data);
  });

  const follow = tryCatch(async (pinUserId) => {
    const res = await userService.followUser(pinUserId, loggedInUser._id);
    toast.success(res.data);
    const pin = await pinService.getAPin(pinId);
    setData(pin.data);
    const { data } = await userService.authUser();
    setLoggedInUser(data);
  });

  const unfollow = tryCatch(async (pinUserId) => {
    const res = await userService.unFollowUser(pinUserId, loggedInUser._id);
    toast.success(res.data);
    const pin = await pinService.getAPin(pinId);
    setData(pin.data);
    const { data } = await userService.authUser();
    setLoggedInUser(data);
  });

  return (
    <PageLayout extra="py-5 px-3 mt-5">
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Fetching pin..." />
          ) : (
            <Row className="g-3">
              <Col lg={6} className="mb-4">
                <div className="w-100">
                  {pin?.image?.map((img, i) => (
                    <div key={i} className="position-relative pinId-Img">
                      {i === current && (
                        <>
                          <LazyLoadImage
                            effect="blur"
                            src={img}
                            alt={pin.title}
                            title="click to view full size"
                            className="rounded-4 object-fit-cover cursor"
                            width="100%"
                            height="100%"
                            onClick={() => {
                              setShowPicModal(true);
                              setCurrent(i);
                            }}
                          />
                          <div
                            title="expand image"
                            className="position-absolute top-0 end-0 p-2"
                          >
                            <Icon
                              icon="material-symbols:expand-content"
                              className="cursor fs-3"
                              style={{ color: "var(--blue200)" }}
                              onClick={() => {
                                setShowPicModal(true);
                                setCurrent(i);
                              }}
                            />
                          </div>
                          {showPicModal && (
                            <PinModal
                              setShowPicModal={setShowPicModal}
                              showPicModal={showPicModal}
                              current={current}
                              pin={pin}
                              prevSlide={prevSlide}
                              nextSlide={nextSlide}
                            />
                          )}

                          {pin?.image?.length > 1 && (
                            <div className="focus-arrowBox">
                              <Icon
                                icon="mdi:arrow-left-bold-circle-outline"
                                className="cursor fs-2 activeIcon position-absolute top-50 start-0 translate-middle z-2"
                                onClick={prevSlide}
                              />
                              <Icon
                                icon="mdi:arrow-right-bold-circle-outline"
                                className="cursor fs-2 activeIcon position-absolute top-50 start-100 translate-middle z-2"
                                onClick={nextSlide}
                              />
                            </div>
                          )}
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
                    <Link to={`/profile/${pin.userId?.userName}`}>
                      <Image
                        src={pin.userId?.profilePhoto}
                        roundedCircle
                        style={{ width: "45px", height: "45px" }}
                        alt={pin.owner}
                      />
                    </Link>
                    <div>
                      <Link
                        to={`/profile/${pin.userId?.userName}`}
                        className="fs-6 fw-bold"
                      >
                        {pin.userId?.userName}
                      </Link>
                      <div>{pin.userId?.subscribers} followers</div>
                    </div>
                  </div>
                  {loggedInUser._id !== pin.userId?._id && (
                    <MyButton
                      text={
                        loggedInUser.subscribedUsers?.includes(pin.userId?._id)
                          ? "Unfollow"
                          : "Follow"
                      }
                      className="border-0 fw-bold"
                      style={{ backgroundColor: "var(--orange100)" }}
                      onClick={
                        loggedInUser.subscribedUsers?.includes(pin.userId?._id)
                          ? () => unfollow(pin.userId?._id)
                          : () => follow(pin.userId?._id)
                      }
                    />
                  )}
                </div>
                <Comments pinId={pinId} />
                {loggedInUser._id === pin?.userId?._id && (
                  <EditPost pin={pin} setData={setData} />
                )}
              </Col>
            </Row>
          )}
          <div className="my-4">
            <h1 className="text-center fs-4 fw-bold">More to explore</h1>
            {relatedPins?.length > 0 ? (
              <div className="mt-4">
                <MasonryLayout>
                  {relatedPins.map((pin) => (
                    <PinCard key={pin._id} {...pin} />
                  ))}
                </MasonryLayout>
              </div>
            ) : (
              <p className="mt-4">
                Sorry we couldn&apos;t find any pins for recommendation.
              </p>
            )}
          </div>
        </>
      )}
    </PageLayout>
  );
};

export default Pindetails;
