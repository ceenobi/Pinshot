import { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Formfields from "./Formfields";
import { registerOptions } from "../utils";
import ImageUpload from "./ImageUpload";
import { pinService, searchService } from "../services";
import { tryCatch, uploadToCloudinary } from "../config";
import toast from "react-hot-toast";
import MyButton from "./MyButton";
import { ClipLoader } from "react-spinners";

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
      title: pin.title,
      description: pin.description,
      image: pin.image,
      tags: pin.tags,
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

  const deletePinTag = tryCatch(async () => {
    await searchService.deleteATag(pin._id);
    const { data } = await pinService.getAPin(pin._id);
    setData(data);
  });

  const deleteInputTag = (index) => {
    const newOptions = [...tagArray];
    newOptions.splice(index, 1);
    setTagArray(newOptions);
  };

  const populateTags = [...tagArray, ...pin.tags];

  const onFormSubmit = tryCatch(async ({ title, description, image }) => {
    let pinImages = [];
    if (image && image.length > 0) {
      const uploadPromises = Array.from(image).map(async (singleImage) => {
        const upload = await uploadToCloudinary(singleImage);
        return upload.data.secure_url;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      pinImages.push(...uploadedUrls);
    }
    const { status, data } = await pinService.updateAPin(
      pin._id,
      title,
      description,
      pinImages,
      populateTags
    );
    if (status === 200) {
      toast.success(data.msg);
      const res = await pinService.getAPin(pin._id);
      setData(res.data);
      handleClose();
    }
  });

  return (
    <>
      <p className="text-end cursor" onClick={handleShow}>
        Edit post
      </p>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Formfields
              register={register}
              errors={errors?.title}
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
              registerOptions={registerOptions}
            />
            <div className="my-4">
              <div className="w-100 d-flex gap-4 align-items-center">
                <Form.Group controlId="tags" className="w-100 mb-4">
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
                      onClick={
                        pin.tags?.length > 0
                          ? deletePinTag
                          : () => deleteInputTag(i)
                      }
                      className="text-white activeIcon"
                      title="delete tag"
                    >
                      x
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <MyButton
              text={isSubmitting ? <ClipLoader color="#96b6c5" /> : "Update"}
              className="border-0 p-2 me-"
              size="lg"
              type="submit"
              variant="none"
              style={{
                backgroundColor: "var(--cream100)",
                color: "var(--dark100)",
                height: "50px",
                width: "100%",
              }}
              disabled={isSubmitting}
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
  setData: PropTypes.any,
};
