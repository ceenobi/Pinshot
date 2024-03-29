import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MyButton } from "@components";
import { PageLayout, Formfields } from "@layouts";
import ImageUpload from "@components/ImageUpload";
import { Loading, registerOptions } from "@utils";
import { useFetch, useTitle, useAuthContext } from "@hooks";
import { pinService, searchService } from "@services";
import { tryCatch, uploadToCloudinary } from "@config";

const CreatePin = () => {
  const { data: fetchTags } = useFetch(searchService.getAllTags);
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState("");
  const [tagArray, setTagArray] = useState([]);
  const [selectTag, setSelectTag] = useState(null);
  const navigate = useNavigate();
  const { isDark } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  useTitle("Create pin");

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
  const filterTags = populateTags.filter((tag) => tag !== null);

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
      filterTags
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
                  <div className="position-relative rounded-5 d-flex flex-column justify-content-center align-items-center h-100 border border-2">
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
                {isDark && <p className="mb-0">Title</p>}
                <Formfields
                  register={register}
                  errors={errors?.title}
                  registerOptions={registerOptions?.title}
                  className={isDark ? "my-2" : "my-4"}
                  id="title"
                  name="title"
                  label="Title"
                  autoFocus={true}
                  type="text"
                  placeholder="Title"
                />
                {isDark && <p className="mb-0">Description</p>}
                <Formfields
                  register={register}
                  errors={errors?.description}
                  registerOptions={registerOptions?.description}
                  as="textarea"
                  rows={2}
                  className={isDark ? "my-2" : "my-4"}
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
                  <Form.Group controlId="tags" className="w-100">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                      type="text"
                      name="tags"
                      size="lg"
                      className="w-100"
                      value={tag.toLowerCase()}
                      onChange={(e) => setTag(e.target.value)}
                    />
                    <p className="small">Add a single tag per time</p>
                  </Form.Group>
                  <span onClick={addTag} className="fw-bold cursor activeIcon">
                    Add
                  </span>
                </div>
                <div className="d-flex gap-2 mb-3 flex-wrap">
                  {tagArray?.map((tag, i) => (
                    <div
                      key={i}
                      className="d-flex flex-wrap align-items-center gap-2 py-2 px-3 rounded-4 text-white activeIcon"
                      style={{ backgroundColor: "var(--blue200)" }}
                      onClick={() => deleteTag(i)}
                    >
                      <span className="fs-6">{tag}</span>
                      <span className="text-white" title="delete tag">
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
              text={isSubmitting ? <ClipLoader color="#ed5b09" /> : "Create"}
              className="border-0 fw-medium btn-style"
              size="lg"
              type="submit"
              variant="none"
              style={{
                backgroundColor: "var(--orange100)",
                color: "var(--cream200)",
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
