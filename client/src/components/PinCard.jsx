import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import toast from "react-hot-toast";
import { downloadImage } from "../utils";
import { tryCatch, useAuthContext } from "../config";
import { pinService } from "../services";
import { useFetch } from "../hooks";

const PinCard = ({ _id, title, image }) => {
  const { data, setData } = useFetch(pinService.getAPin, _id);
  const { loggedInUser } = useAuthContext();

  const handleLike = tryCatch(async () => {
    const res = await pinService.likeAPin(_id, loggedInUser._id);
    toast.success(res.data);
    const pin = await pinService.getAPin(_id);
    setData(pin.data);
  });
  const handleDislike = tryCatch(async () => {
    const res = await pinService.dislikeAPin(_id, loggedInUser._id);
    toast.success(res.data);
    const pin = await pinService.getAPin(_id);
    setData(pin.data);
  });

  return (
    <div className="cardBox w-100 h-auto rounded-4">
      <Link to={`/pin/${_id}`}>
        <LazyLoadImage
          alt={title}
          effect="blur"
          src={image[0]}
          className="w-100 h-100 rounded-4 object-fit-cover"
        />
      </Link>
      <div className="d-none d-xl-block focus-heart p-2">
        <Icon
          icon="mdi:cards-heart"
          className="fs-5 cursor"
          style={{
            color: data.likes?.includes(loggedInUser._id)
              ? "red"
              : "var(--cream200)",
          }}
          onClick={
            data.likes?.includes(loggedInUser._id) ? handleDislike : handleLike
          }
        />
      </div>
      <div className="d-none d-xl-flex p-3 focus-content">
        <Icon
          icon="material-symbols:download-2-outline"
          className="fs-5 cursor"
          style={{ color: "var(--cream200)" }}
          onClick={() => downloadImage(_id, image[0])}
        />
      </div>
    </div>
  );
};

export default PinCard;

PinCard.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  image: PropTypes.array,
  likes: PropTypes.array,
};
