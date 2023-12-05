import { Image, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import TimeAgo from "timeago-react";
import { Icon } from "@iconify/react";

const CommentModal = ({
  handleClose,
  show,
  pinComments,
  loggedInUser,
  handleLike,
  handleDislike,
  deleteComment,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton />
      <Modal.Body>
        {pinComments?.map((comment, i) => (
          <div className="d-flex gap-2 mb-3" key={i}>
            <div className="d-flex gap-2">
              <Link to={`/profile/${comment?.userId?.userName}`}>
                <Image
                  src={comment?.userId?.profilePhoto}
                  roundedCircle
                  style={{ width: "35px", height: "35px" }}
                  alt={comment?.userId?.userName}
                />
              </Link>
              <span className="fw-bold">{comment?.userId?.userName}</span>
            </div>
            <div>
              <span>{comment?.comment}</span>
              <div className="d-flex align-items-center gap-3">
                <TimeAgo
                  datetime={comment?.createdAt}
                  locale="en_US"
                  style={{ fontSize: "14px" }}
                />
                <div className="d-inline-block">
                  <Icon
                    icon="mdi:thumb-up"
                    className={`cursor me-2 ${
                      comment?.likes?.includes(loggedInUser._id)
                        ? "text-danger"
                        : "text-secondary activeIcon "
                    }`}
                    onClick={
                      comment?.likes?.includes(loggedInUser._id)
                        ? () => handleDislike(comment?._id)
                        : () => handleLike(comment?._id)
                    }
                  />
                  <span style={{ fontSize: "14px" }}>
                    {comment?.likeCount} likes
                  </span>
                  {loggedInUser.role?.includes("admin") && (
                    <Icon
                      icon="mdi:delete-empty"
                      className="cursor mx-3 text-secondary  activeIcon"
                      onClick={() => deleteComment(comment?._id)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default CommentModal;

CommentModal.propTypes = {
  handleClose: PropTypes.func,
  show: PropTypes.any,
  pinComments: PropTypes.array,
  loggedInUser: PropTypes.any,
  handleLike: PropTypes.any,
  handleDislike: PropTypes.any,
  deleteComment: PropTypes.any,
};
