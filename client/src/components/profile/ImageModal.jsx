import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { useAuthContext } from "@hooks";
import MyButton from "../MyButton";
import MyModal from "../MyModal";

const ImageModal = ({
  showPicModal,
  setShowPicModal,
  data,
  deletePinPost,
  prevSlide,
  nextSlide,
  current,
}) => {
  const { loggedInUser } = useAuthContext();
  const handleClose = () => setShowPicModal(false);

  const deletePost = (pinId) => {
    deletePinPost(pinId);
    handleClose();
  };

  return (
    <MyModal
      show={showPicModal}
      handleClose={handleClose}
      fullscreen={true}
      backdrop="static"
    >
      <div className="container position-relative py-2">
        {data.pins.map(
          (item, i) =>
            i === current && (
              <div key={item._id}>
                <Link to={`/pin/${item._id}`}>
                  <LazyLoadImage
                    effect="blur"
                    src={item?.image[0]}
                    alt={item.title}
                    className="cursor px-md-2"
                    width={"100%"}
                    height={"100%"}
                  />
                </Link>
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
                {loggedInUser._id === item.userId && (
                  <div className="my-3 d-flex justify-content-center">
                    <MyButton
                      text="Delete pin"
                      style={{ backgroundColor: "var(--orange100)" }}
                      className="border-0 fw-medium"
                      onClick={() => deletePost(item._id)}
                    />
                  </div>
                )}
              </div>
            )
        )}
      </div>
    </MyModal>
  );
};

export default ImageModal;

ImageModal.propTypes = {
  pinId: PropTypes.string,
  showPicModal: PropTypes.any,
  setShowPicModal: PropTypes.any,
  current: PropTypes.number,
  setCurrent: PropTypes.any,
  setData: PropTypes.any,
  data: PropTypes.any,
  deletePinPost: PropTypes.func,
  prevSlide: PropTypes.func,
  nextSlide: PropTypes.func,
};
