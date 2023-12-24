import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";

const ReactInfiniteScroll = ({ children, dataLength, next, hasMore }) => {
  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={next}
      hasMore={hasMore}
      loader={
        <div className="d-flex flex-column justify-content-center align-items-center">
          <ClipLoader color="rgb(126, 182, 154)" />
          <p>Fetching pins</p>
        </div>
      }
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {children}
    </InfiniteScroll>
  );
};

export default ReactInfiniteScroll;

ReactInfiniteScroll.propTypes = {
  children: PropTypes.node.isRequired,
  dataLength: PropTypes.number,
  next: PropTypes.func,
  hasMore: PropTypes.any,
};
