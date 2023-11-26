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
              <Link to={`/profile/${comment?.owner}`}>
                <Image
                  src={comment?.avatar}
                  roundedCircle
                  style={{ width: "35px", height: "35px" }}
                  alt={comment?.owner}
                />
              </Link>
              <span className="fw-bold">{comment?.owner}</span>
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
                  {loggedInUser.role?.includes("user") && (
                    <Icon
                      icon="mdi:delete-empty-outline"
                      className="cursor mx-4"
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
  loggedInUser: PropTypes.object,
  handleLike: PropTypes.any,
  handleDislike: PropTypes.any,
  deleteComment: PropTypes.any,
};
