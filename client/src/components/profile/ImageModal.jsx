import { Icon } from "@iconify/react";
import MyButton from "../MyButton";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ImageModal = ({
  showPicModal,
  setShowPicModal,
  current,
  setCurrent,
  data,
  deletePinPost,
}) => {
  const handleClose = () => setShowPicModal(false);

  const imgSlide = data.pins?.map((item) => item.image);
  const imgLength = imgSlide.length;

  const nextSlide = () => {
    setCurrent(current === imgLength - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? imgLength - 1 : current - 1);
  };

  const deletePost = (pinId) => {
    deletePinPost(pinId);
    handleClose();
  };

  return (
    <>
      <Modal
        show={showPicModal}
        onHide={handleClose}
        fullscreen={true}
        backdrop="static"
      >
        <Modal.Header closeButton />
        <Modal.Body>
          <div className="container position-relative py-2">
            {data.pins.map(
              (item, i) =>
                i === current && (
                  <div key={item._id}>
                    <LazyLoadImage
                      effect="blur"
                      src={item?.image}
                      alt={item.title}
                      className="cursor px-md-2"
                      width={"100%"}
                      height={"100%"}
                    />
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
                    <div className="my-3 d-flex justify-content-center">
                      <MyButton
                        text="Delete pin"
                        onClick={() => deletePost(item._id)}
                      />
                    </div>
                  </div>
                )
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
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
};
