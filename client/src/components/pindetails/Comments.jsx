import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import TimeAgo from "timeago-react";
import { ClipLoader } from "react-spinners";
import { registerOptions } from "@utils";
import { tryCatch} from "@config";
import { commentService } from "@services";
import { useFetch, useAuthContext } from "@hooks";
import {Formfields} from "@layouts";
import MyButton from "../MyButton";
import CommentModal from "./CommentModal";

const Comments = ({ pinId }) => {
  const [show, setShow] = useState(false);
  const { loggedInUser } = useAuthContext();
  const {
    error,
    loading,
    data: pinComments,
    setData,
  } = useFetch(commentService.getPinComments, pinId);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLike = tryCatch(async (commentId) => {
    const res = await commentService.likeAComment(commentId, loggedInUser._id);
    toast.success(res.data);
    const { data } = await commentService.getPinComments(pinId);
    setData(data);
  });

  const handleDislike = tryCatch(async (commentId) => {
    const res = await commentService.dislikeAComment(
      commentId,
      loggedInUser._id
    );
    toast.success(res.data);
    const { data } = await commentService.getPinComments(pinId);
    setData(data);
  });

  const deleteComment = tryCatch(async (commentId) => {
    const res = await commentService.deleteAComment(commentId);
    toast.success(res.data);
    setData(
      pinComments.filter((existingComment) => existingComment._id !== commentId)
    );
  });

  const onFormSubmit = tryCatch(async ({ comment }) => {
    const res = await commentService.postComment(pinId, comment);
    toast.success(res.data.msg);
    const { data } = await commentService.getPinComments(pinId);
    setData(data);
  });

  return (
    <div className="my-5">
      <div className="d-flex mb-4">
        <Form
          className="w-100 d-flex gap-2 align-items-center"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Image
            src={loggedInUser.profilePhoto}
            roundedCircle
            style={{ width: "45px", height: "45px" }}
            alt={loggedInUser.userName}
            className="object-fit-cover"
          />
          <Formfields
            as="textarea"
            rows={2}
            register={register}
            errors={errors?.comment}
            registerOptions={registerOptions?.comment}
            className="w-100 ms-2"
            id="comment"
            name="comment"
            label="Leave a comment... 😃"
          />
          <MyButton
            text={
              isSubmitting ? (
                <ClipLoader color="#96b6c5" />
              ) : (
                <Icon
                  icon="mdi:send"
                  className="fs-2 text-secondary activeIcon"
                />
              )
            }
            variant="none"
            type="submit"
            disabled={isSubmitting}
          />
        </Form>
      </div>
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          <p className="fs-6 fw-bold">
            {pinComments && pinComments?.length > 0
              ? `${pinComments?.length} comments`
              : "No comments yet. Be the first to add"}
          </p>
          {pinComments && pinComments?.length > 0 && (
            <div className="my-4">
              {pinComments?.slice(0, 3).map((comment) => (
                <div className="d-flex flex-wrap gap-1 mb-3" key={comment?._id}>
                  <div className="d-flex gap-2">
                    <Link to={`/profile/${comment?.userId?.userName}`}>
                      <Image
                        src={comment?.userId?.profilePhoto}
                        roundedCircle
                        style={{ width: "25px", height: "25px" }}
                        alt={comment?.userId?.userName}
                        className="object-fit-cover"
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
                              ? () => handleDislike(comment._id)
                              : () => handleLike(comment._id)
                          }
                        />
                        <span style={{ fontSize: "14px" }}>
                          {comment?.likeCount} likes
                        </span>
                        {loggedInUser.role?.includes("admin") && (
                          <Icon
                            icon="mdi:delete-empty"
                            className="cursor mx-3 text-secondary activeIcon"
                            onClick={() => deleteComment(comment?._id)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {pinComments?.length > 4 && (
                <p className="text-end cursor activeIcon" onClick={handleShow}>
                  See all comments
                </p>
              )}
              <CommentModal
                show={show}
                handleClose={handleClose}
                pinComments={pinComments}
                loading={loading}
                loggedInUser={loggedInUser}
                setData={setData}
                handleLike={handleLike}
                handleDislike={handleDislike}
                deleteComment={deleteComment}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comments;

Comments.propTypes = {
  pinId: PropTypes.string,
};
