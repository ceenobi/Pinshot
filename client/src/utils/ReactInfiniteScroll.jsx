import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";

const ReactInfiniteScroll = ({
  children,
  dataLength,
  fetchMoreData,
  hasMore,
}) => {
  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        <div className="d-flex justify-content-center">
          <ClipLoader color="#96b6c5" />
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
  fetchMoreData: PropTypes.func,
  hasMore: PropTypes.any,
};
