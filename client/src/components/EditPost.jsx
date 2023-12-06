import { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Formfields from "./Formfields";
import { registerOptions } from "../utils";
import ImageUpload from "./ImageUpload";

const EditPost = ({ pin }) => {
  const [show, setShow] = useState(false);
  const [image, setImage] = useState([]);
  const [extra, setExtra] = useState("");
  const [extraOptions, setExtraOptions] = useState([]);

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

  const addExtra = (event) => {
    if (event.key === "Enter") {
      if (extra !== "") {
        setExtraOptions(extraOptions, extraOptions.push(extra));
        setExtra("");
      }
    }
  };

  const deleteTag = (index) => {
    const newOptions = [...extraOptions];
    newOptions.splice(index, 1);
    setExtraOptions(newOptions);
  };

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
              setImage={setImage}
              image={image}
              multiple={true}
            />
            <div className="">
              <Form.Group controlId="tags" className="mb-4 w-100">
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  size="lg"
                  className="w-100"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  onKeyDown={addExtra}
                />
              </Form.Group>
              <div className="d-flex gap-2 mb-0 flex-wrap">
                {pin.tags?.map((option, i) => (
                  <div
                    key={i}
                    className="d-flex flex-wrap align-items-center gap-3 p-2 rounded-3 text-white"
                    style={{ backgroundColor: "var(--blue100)" }}
                  >
                    <span className="fs-6 ">{option}</span>
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
};
