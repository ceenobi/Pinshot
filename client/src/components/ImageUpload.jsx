import PropTypes from "prop-types";
import { useState } from "react";
import { Form, Image } from "react-bootstrap";

export default function ImageUpload({ id, name, setImage , register}) {
  const [preview, setPreview] = useState();

  const onChangePicture = (e) => {
    // setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
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
          multiple={true}
          {...register("profilePhoto")}
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
  register: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  setImage: PropTypes.any,
};
