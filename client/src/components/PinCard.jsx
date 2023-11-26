import PropTypes from "prop-types";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { downloadImage } from "../utils";

const PinCard = ({ _id, title, image }) => {
  return (
    <div className="cardBox w-100 h-auto rounded-4">
      <Link to={`/pin/${_id}`}>
        <Image
          className="w-100 h-100 rounded-4 object-fit-fill"
          src={image[0]}
          alt={title}
          loading="lazy"
        />
      </Link>
      <div className="d-none d-xl-block focus-heart p-2">
        <Icon
          icon="mdi:cards-heart"
          className="fs-3 cursor"
          style={{ color: "var(--cream200)" }}
        />
      </div>
      <div className="d-none d-xl-block p-2 focus-content">
        <Icon
          icon="material-symbols:download-2-outline"
          className="fs-3 cursor "
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
};
