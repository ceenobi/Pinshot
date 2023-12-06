import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Formfields, PageLayout } from "../components";
import ImageUpload from "../components/ImageUpload";
import { useForm } from "react-hook-form";
import { registerOptions } from "../utils";
import { useFetch } from "../hooks";
import { searchService } from "../services";

const CreatePin = () => {
  const { error, loading, data: tags } = useFetch(searchService.getAllTags);
  const [image, setImage] = useState([]);
  const [selectTag, setSelectTag] = useState("");
  const [extra, setExtra] = useState("");
  const [extraOptions, setExtraOptions] = useState([]);
  console.log("taff", tags);
  console.log("ta", selectTag);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

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
    <PageLayout extra="py-5 px-3 mt-5">
      <h1 className="fs-5 fw-bold border-bottom pb-3 w-100 bg-white">
        Create Pin
      </h1>
      <Row className="g-3 py-4">
        <Col lg={6} className="mb-4">
          <div
            className="position-relative mx-auto rounded-5 cursor"
            style={{ height: "350px", width: "80%" }}
          >
            <div className="position-relative rounded-5 d-flex flex-column justify-content-center align-items-center h-100 bg-secondary-subtle">
              <Icon icon="material-symbols:backup" className="fs-1" />
              <p>Choose a file(s) </p>
              <p
                className="position-absolute translate middle text-center"
                style={{ bottom: "5%" }}
              >
                File with maximum size of 5MB is allowed
              </p>
            </div>
            <ImageUpload
              id="imageUpload"
              name="imageUpload"
              setImage={setImage}
              image={image}
              multiple={true}
              className="opacity-0 position-absolute translate middle top-0 end-0 h-100"
            />
          </div>
        </Col>
        <Col lg={6} className="mb-4 px-lg-4">
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
              placeholder="Add a detailed description"
            />
            <Form.Label>Select popular tags</Form.Label>
            <Form.Select
              aria-label="select a tag"
              size="lg"
              className="mb-4"
              onChange={(e) => setSelectTag(e.target.value)}
            >
              {tags.map((tag, i) => (
                <option value={tag} key={i}>
                  {tag}
                </option>
              ))}
            </Form.Select>
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
              {extraOptions?.map((option, i) => (
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
          </Form>
        </Col>
      </Row>
    </PageLayout>
  );
};

export default CreatePin;
