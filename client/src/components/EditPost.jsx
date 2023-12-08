import { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Formfields from "./Formfields";
import { registerOptions } from "../utils";
import ImageUpload from "./ImageUpload";
import { pinService, searchService } from "../services";
import { tryCatch } from "../config";

const EditPost = ({ pin, setData }) => {
  const [show, setShow] = useState(false);
  const [tag, setTag] = useState("");
  const [tagArray, setTagArray] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      image: undefined,
      tags: pin.tags,
      title: pin.title,
      description: pin.description,
    },
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addTag = () => {
    if (tag !== "") {
      setTagArray(tagArray, tagArray.push(tag));
      setTag("");
    }
  };

  const deleteTag = tryCatch(async () => {
    await searchService.deleteATag(pin._id);
    const { data } = await pinService.getAPin(pin._id);
    setData(data);
  });

  const populateTags = [...tagArray, ...pin.tags];

  return (
    <>
      <p className="text-end cursor" onClick={handleShow}>
        edit post
      </p>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Formfields
              register={register}
              errors={errors?.userName}
              registerOptions={registerOptions?.title}
              className="my-4"
              id="title"
              name="title"
              label="Title"
              autoFocus={true}
              type="text"
              placeholder="Title"
            />
            <Formfields
              register={register}
              errors={errors?.description}
              registerOptions={registerOptions?.description}
              as="textarea"
              rows={2}
              className="my-4"
              id="description"
              name="description"
              label="Description"
              placeholder="Description"
            />
            <ImageUpload
              id="image"
              name="image"
              title="Upload images"
              multiple={true}
              register={register}
              errors={errors?.image}
              registerOptions={registerOptions?.image}
            />
            <div>
              <div className="w-100 d-flex gap-4 align-items-center">
                <Form.Group controlId="tags" className="mb-4 w-100">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    size="lg"
                    className="w-100"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  />
                </Form.Group>
                <span onClick={addTag} className="fw-bold cursor">
                  Add
                </span>
              </div>
              <div className="d-flex gap-2 mb-3 flex-wrap">
                {populateTags?.map((tag, i) => (
                  <div
                    key={i}
                    className="d-flex flex-wrap align-items-center gap-3 py-2 px-3 rounded-4 text-white"
                    style={{ backgroundColor: "var(--dark100)" }}
                  >
                    <span className="fs-6">{tag}</span>
                    <span
                      onClick={deleteTag}
                      className="text-white activeIcon"
                      title="delete tag"
                    >
                      x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditPost;

EditPost.propTypes = {
  pin: PropTypes.object,
  setData: PropTypes.any,
};
