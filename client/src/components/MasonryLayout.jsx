import PropTypes from "prop-types";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 4,
  2000: 5,
  1100: 4,
  700: 3,
  500: 2,
  300: 1,
};

const MasonryLayout = ({ children }) => {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {children}
    </Masonry>
  );
};

export default MasonryLayout;

MasonryLayout.propTypes = {
  children: PropTypes.node || PropTypes.any,
};
