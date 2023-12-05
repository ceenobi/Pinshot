import PropTypes from "prop-types";
import { useState } from "react";
import { Form, Image } from "react-bootstrap";
import toast from "react-hot-toast";

export default function ImageUpload({
  id,
  name,
  setImage,
  title,
  ...props
}) {
  const [preview, setPreview] = useState();

  const onChangePicture = (e) => {
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      if (e.target.files && e.target.files[i]) {
        if (e.target.files[i].size > 1 * 1000 * 1024) {
          toast.error("File with maximum size of 1MB is allowed");
          return false;
        }
        images.push(URL.createObjectURL(e.target.files[i]));
        setImage(e.target.files);
        setPreview(images);
      }
    }
  };

  return (
    <div>
      {" "}
      <Form.Group controlId={id} className="mb-4">
        <Form.Label>{title}</Form.Label>
        <Form.Control
          type="file"
          name={name}
          size="lg"
          accept="image/png, image/jpeg, image/webp"
          {...props}
          onChange={onChangePicture}
        />
      </Form.Group>
      {preview && (
        <div>
          {preview.map((img, i) => {
            return (
              <Image
                src={img}
                alt={"image-" + i}
                key={i}
                style={{ width: "50px", height: "50px" }}
                roundedCircle
                className="object-fit-cover mb-3 me-2"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

ImageUpload.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  title: PropTypes.string,
  setImage: PropTypes.any,
};
