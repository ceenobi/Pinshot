import PropTypes from "prop-types";
import { useState } from "react";
import { Form, Image } from "react-bootstrap";
import toast from "react-hot-toast";

export default function ImageUpload({ id, name, setImage, ...props }) {
  const [preview, setPreview] = useState();

  const onChangePicture = (e) => {
    const file = e.target.files;
    if (file.size > 30) {
      toast.error("File size too large, consider reducing it");
      return;
    } else {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div>
      {" "}
      <Form.Group controlId={id} className="mb-4">
        <Form.Label>Upload Profile photo</Form.Label>
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
        <Image
          src={preview}
          style={{ width: "80px", height: "80px" }}
          roundedCircle
          className="object-fit-cover mb-3"
        />
      )}
    </div>
  );
}

ImageUpload.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  setImage: PropTypes.any,
};
