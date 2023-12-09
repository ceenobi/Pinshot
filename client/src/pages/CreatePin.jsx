import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Formfields, MyButton, PageLayout } from "../components";
import ImageUpload from "../components/ImageUpload";
import { Loading, registerOptions } from "../utils";
import { useFetch } from "../hooks";
import { pinService, searchService } from "../services";
import { tryCatch, uploadToCloudinary } from "../config";
import { useNavigate } from "react-router-dom";

const CreatePin = () => {
  const { data: fetchTags } = useFetch(searchService.getAllTags);
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState("");
  const [tagArray, setTagArray] = useState([]);
  const [selectTag, setSelectTag] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    document.title = "Create post";
  }, []);

  const addTag = () => {
    if (tag !== "") {
      setTagArray(tagArray, tagArray.push(tag));
      setTag("");
    }
  };

  const deleteTag = (index) => {
    const newOptions = [...tagArray];
    newOptions.splice(index, 1);
    setTagArray(newOptions);
  };

  const populateTags = [...tagArray, selectTag];

  const onFormSubmit = tryCatch(async ({ title, description, image }) => {
    setLoading(true);
    let pinImages = [];
    if (image) {
      const uploadPromises = Array.from(image).map(async (singleImage) => {
        const upload = await uploadToCloudinary(singleImage);
        return upload.data.secure_url;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      pinImages.push(...uploadedUrls);
    }
    const { status, data } = await pinService.createAPin(
      title,
      description,
      pinImages,
      populateTags
    );
    if (status === 201) {
      toast.success(data.msg);
      navigate("/");
    }
    setLoading(false);
  });

  return (
    <PageLayout extra="py-5 px-3 mt-5">
      <h1 className="fs-5 fw-bold">Create Pin</h1>
      {loading ? (
        <Loading text="Posting pin..." />
      ) : (
        <>
          <Form
            id="createPostForm"
            onSubmit={handleSubmit(onFormSubmit)}
            className="my-4 border p-4"
          >
            <Row className="g-3 align-items-center">
              <Col lg={6} className="my-4">
                <div
                  className="position-relative mx-auto rounded-5 cursor"
                  style={{ height: "350px", width: "85%" }}
                >
                  <div className="position-relative rounded-5 d-flex flex-column justify-content-center align-items-center h-100 bg-secondary-subtle">
                    <Icon icon="material-symbols:backup" className="fs-1" />
                    <p>Choose a file(s)</p>
                    <p
                      className="position-absolute translate middle text-center px-4"
                      style={{ bottom: "5%" }}
                    >
                      File with maximum size of 5MB is allowed
                    </p>
                  </div>
                  <ImageUpload
                    id="image"
                    name="image"
                    multiple={true}
                    register={register}
                    errors={errors?.image}
                    registerOptions={registerOptions?.image}
                    className="opacity-0 position-absolute translate middle top-0 end-0 h-100"
                  />
                </div>
              </Col>
              <Col lg={6} className="mb-4 px-lg-4">
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
                {fetchTags && fetchTags?.length > 0 && (
                  <Form.Group>
                    <Form.Label>See popular tags</Form.Label>
                    <Form.Select
                      aria-label="select a tag"
                      size="lg"
                      className="mb-4"
                      onChange={(e) => setSelectTag(e.target.value)}
                    >
                      {fetchTags.map((tag, i) => (
                        <option value={tag} key={i}>
                          {tag}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
                <p className="text-center">OR create your tags</p>
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
                  {tagArray?.map((tag, i) => (
                    <div
                      key={i}
                      className="d-flex flex-wrap align-items-center gap-3 py-2 px-3 rounded-4 text-white"
                      style={{ backgroundColor: "var(--dark100)" }}
                    >
                      <span className="fs-6">{tag}</span>
                      <span
                        onClick={()=>deleteTag(i)}
                        className="text-white activeIcon"
                        title="delete tag"
                      >
                        x
                      </span>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-center justify-content-lg-end px-4">
            <MyButton
              text={isSubmitting ? <ClipLoader color="#96b6c5" /> : "Create"}
              className="border-0 p-2 me-"
              size="lg"
              type="submit"
              variant="none"
              style={{
                backgroundColor: "var(--cream100)",
                color: "var(--dark100)",
                height: "50px",
                width: "260px",
              }}
              disabled={isSubmitting}
              form="createPostForm"
            />
          </div>
        </>
      )}
    </PageLayout>
  );
};

export default CreatePin;
