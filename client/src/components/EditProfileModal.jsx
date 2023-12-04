import { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { Formfields, MyButton } from "../components";
import { registerOptions } from "../utils";
import { ClipLoader } from "react-spinners";
import { tryCatch } from "../config";
import { uploadToCloudinary, userService } from "../services";
import ImageUpload from "./ImageUpload";

const EditProfileModal = ({ user, setData }) => {
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState({ started: false, pc: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      userName: user.userName,
      email: user.email,
      password: "",
      bio: user.bio,
    },
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onFormSubmit = tryCatch(async ({ userName, email, password, bio }) => {
    let uploadedImg = "";
    if (image) {
      const upload = await uploadToCloudinary(image);
      console.log(upload);
      uploadedImg = upload.data.secure_url;
    }
    const { status, data } = await userService.updateProfile(
      userName,
      email,
      password,
      uploadedImg,
      bio
    );
    if (status === 200) {
      localStorage.setItem("usertoken", JSON.stringify(data.access_token));
      toast.success(data.msg);
      const userinfo = await userService.getUserProfile(user.userName);
      setData(userinfo.data);
      handleClose();
    }
  });

  return (
    <>
      <p className="text-center cursor" onClick={handleShow}>
        Edit
      </p>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Formfields
              register={register}
              errors={errors?.userName}
              registerOptions={registerOptions?.userName}
              className="my-4"
              id="userName"
              name="userName"
              label="Username"
              autoFocus={true}
              type="text"
              placeholder="Username"
              showPassword={showPassword}
              togglePassword={togglePassword}
            />
            <Formfields
              register={register}
              errors={errors?.email}
              registerOptions={registerOptions?.email}
              className="my-4"
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="Email"
            />
            <Formfields
              register={register}
              className="my-4 position-relative"
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Password"
              showPassword={showPassword}
              togglePassword={togglePassword}
            />
            <Formfields
              register={register}
              className="my-4 position-relative"
              id="bio"
              name="bio"
              label="Bio"
              type="text"
              placeholder="Bio"
            />
            <ImageUpload
              id="profilePhoto"
              name="profilePhoto"
              setImage={setImage}
            />
            <MyButton
              text={isSubmitting ? <ClipLoader color="#96b6c5" /> : "Update"}
              className="w-100 border-0 p-2"
              size="lg"
              type="submit"
              variant="none"
              style={{
                backgroundColor: "var(--cream100)",
                color: "var(--dark100)",
                height: "50px",
              }}
              disabled={isSubmitting}
            />
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditProfileModal;

EditProfileModal.propTypes = {
  user: PropTypes.object,
  setData: PropTypes.any,
};
