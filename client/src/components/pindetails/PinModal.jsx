import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Icon } from "@iconify/react";
import MyModal from "../MyModal";

const PinModal = ({
  setShowPicModal,
  showPicModal,
  current,
  pin,
  prevSlide,
  nextSlide,
}) => {
  const handleClose = () => setShowPicModal(false);

  const imgSlide = pin.image.map((image) => image);

  return (
    <MyModal
      show={showPicModal}
      handleClose={handleClose}
      fullscreen={true}
      backdrop="static"
    >
      <div className="container position-relative w-100 min-h-100">
        <LazyLoadImage
          effect="blur"
          src={imgSlide[current]}
          alt="Pin image full display"
          className="px-md-2 object-fit-cover"
          width={"100%"}
          height={"100%"}
        />
        {imgSlide?.length > 1 && (
          <>
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
          </>
        )}
      </div>
    </MyModal>
  );
};

export default PinModal;

PinModal.propTypes = {
  showPicModal: PropTypes.any,
  setShowPicModal: PropTypes.any,
  current: PropTypes.number,
  setCurrent: PropTypes.any,
  pin: PropTypes.any,
  prevSlide: PropTypes.func,
  nextSlide: PropTypes.func,
};
