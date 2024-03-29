import { useState } from "react";
import { Form, Image } from "react-bootstrap";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

export default function ImageUpload({
  register,
  registerOptions,
  id,
  name,
  title,
  errors,
  ...props
}) {
  const [preview, setPreview] = useState();

  const onChangePicture = (e) => {
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      if (e.target.files && e.target.files[i]) {
        if (e.target.files[i].size > 1 * 1000 * 5012) {
          toast.error("File with maximum size of 5MB is allowed");
          return false;
        }
        images.push(URL.createObjectURL(e.target.files[i]));
        setPreview(images);
      }
    }
  };

  return (
    <>
      <Form.Group controlId={id} className="mb-3">
        <Form.Label>{title}</Form.Label>
        <Form.Control
          type="file"
          name={name}
          {...register(name, registerOptions)}
          size="lg"
          accept="image/*"
          {...props}
          onChange={onChangePicture}
          isInvalid={!!errors}
        />
        <Form.Control.Feedback type="invalid" className="mb-4">
          {errors?.message}
        </Form.Control.Feedback>
      </Form.Group>
      {preview && (
        <>
          {preview.map((img, i) => (
            <Image
              src={img}
              alt={"image-" + i}
              key={i}
              style={{ width: "50px", height: "50px" }}
              roundedCircle
              className="object-fit-cover mb-3 me-2"
            />
          ))}
        </>
      )}
    </>
  );
}

ImageUpload.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  title: PropTypes.string,
  register: PropTypes.func,
  registerOptions: PropTypes.object,
  errors: PropTypes.object,
};
