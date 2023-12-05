import { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Formfields from "./Formfields";
import { registerOptions } from "../utils";
import ImageUpload from "./ImageUpload";

const EditPost = ({ pin }) => {
  const [show, setShow] = useState(false);
  const [image, setImage] = useState("");
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
