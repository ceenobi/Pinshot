import { useState } from "react";
import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import toast from "react-hot-toast";
import { useCurentSlide, useFetch } from "../../hooks";
import { pinService } from "../../services";
import { Loading } from "../../utils";
import MasonryLayout from "../MasonryLayout";
import ImageModal from "./ImageModal";
import { tryCatch } from "../../config";

const UserPins = ({ userId }) => {
  const { data, error, loading, setData } = useFetch(
    pinService.getPinsByUser,
    userId
  );
  const imgSlide = data.pins?.map((item) => item.image);
  const imgLength = imgSlide?.length;
  const { prevSlide, nextSlide, current, setCurrent } =
    useCurentSlide(imgLength);
  const [showPicModal, setShowPicModal] = useState(false);

  const openModal = (i) => {
    setShowPicModal(true);
    setCurrent(i);
  };

  const deletePinPost = tryCatch(async (pinId) => {
    const res = await pinService.deleteAPin(pinId);
    toast.success(res.data);
    const { data } = await pinService.getPinsByUser(userId);
    setData(data);
  });

  return (
    <div className="mt-5">
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Fetching pins..." />
          ) : (
            <>
              {data.pins?.length > 0 ? (
                <MasonryLayout>
                  {data?.pins?.map((pin, i) => (
                    <div key={pin._id} className="w-100 h-auto rounded-4">
                      <LazyLoadImage
                        alt={pin.title}
                        effect="blur"
                        src={pin?.image[0]}
                        className="rounded-4 object-fit-cover cursor"
                        width={"100%"}
                        height={"100%"}
                        onClick={() => openModal(i)}
                      />
                      {showPicModal && (
                        <ImageModal
                          setShowPicModal={setShowPicModal}
                          showPicModal={showPicModal}
                          prevSlide={prevSlide}
                          nextSlide={nextSlide}
                          current={current}
                          data={data}
                          deletePinPost={deletePinPost}
                        />
                      )}
                    </div>
                  ))}
                </MasonryLayout>
              ) : (
                <p>You have no pin posted yet.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserPins;

UserPins.propTypes = {
  userId: PropTypes.string,
};
