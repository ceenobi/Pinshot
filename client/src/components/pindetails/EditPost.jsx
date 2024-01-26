import { useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { Formfields } from "@layouts";
import { registerOptions } from "@utils";
import { pinService, searchService } from "@services";
import { tryCatch, uploadToCloudinary } from "@config";
import MyButton from "../MyButton";
import ImageUpload from "../ImageUpload";
import MyModal from "../MyModal";

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
      title: pin?.title,
      description: pin?.description,
      tags: pin?.tags,
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

  const populateTags = [...tagArray, pin?.tags];
  const flattenTags = populateTags.flatMap((tag) => tag);
  const filterTags = flattenTags.filter((tag) => tag !== null);

  const onFormSubmit = tryCatch(async ({ title, description, image }) => {
    let pinImages = [];
    if (image && image?.length > 0) {
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
      filterTags
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
      <MyModal show={show} handleClose={handleClose} title="Edit post">
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
          />
          <div className="my-4">
            <div className="w-100 d-flex gap-4 align-items-center">
              <Form.Group controlId="tags" className="w-100">
                <Form.Label className="">Tags</Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  size="lg"
                  className="w-100"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
                <p className="small">Add a single tag per time</p>
              </Form.Group>
              <span onClick={addTag} className="fw-bold cursor activeIcon">
                Add
              </span>
            </div>
            <div className="d-flex gap-2 mb-3 flex-wrap">
              {filterTags?.map((tag, i) => (
                <div
                  key={i}
                  className="d-flex flex-wrap align-items-center gap-2 py-2 px-3 rounded-4 text-white activeIcon"
                  style={{ backgroundColor: "var(--blue200)" }}
                  onClick={
                    pin.tags?.length > 0
                      ? deletePinTag
                      : () => deleteInputTag(i)
                  }
                >
                  <span className="fs-6">{tag}</span>
                  <span className="text-white" title="delete tag">
                    x
                  </span>
                </div>
              ))}
            </div>
          </div>
          <MyButton
            text={isSubmitting ? <ClipLoader color="#ed5b09" /> : "Update"}
            className="border-0 fw-medium"
            size="lg"
            type="submit"
            variant="solid"
            style={{
              backgroundColor: "var(--orange100)",
              color: "var(--cream200)",
              height: "50px",
              width: "100%",
            }}
            disabled={isSubmitting}
          />
        </Form>
      </MyModal>
    </>
  );
};

export default EditPost;

EditPost.propTypes = {
  pin: PropTypes.object,
  setData: PropTypes.any,
};
