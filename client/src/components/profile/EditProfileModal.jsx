import { useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import Formfields from "../form/Formfields";
import MyButton from "../MyButton";
import { registerOptions } from "../../utils";
import { ClipLoader } from "react-spinners";
import { tryCatch, uploadToCloudinary } from "../../config";
import { userService } from "../../services";
import ImageUpload from "../ImageUpload";
import MyModal from "../MyModal";

const EditProfileModal = ({ user, setData }) => {
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
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

  const onFormSubmit = tryCatch(
    async ({ userName, email, password, profileImage, bio }) => {
      let profilePhoto = "";
      if (profileImage && profileImage?.length > 0) {
        const uploadResponse = await uploadToCloudinary(profileImage[0]);
        profilePhoto = uploadResponse.data.secure_url;
      }
      const { status, data } = await userService.updateProfile(
        userName,
        email,
        password,
        profilePhoto,
        bio
      );
      if (status === 200) {
        localStorage.setItem("usertoken", JSON.stringify(data.access_token));
        toast.success(data.msg);
        const res = await userService.getUserProfile(userName);
        setData(res.data);
        navigate(`/profile/${res.data.userName}`);
        handleClose();
      }
    }
  );

  return (
    <>
      <p className="text-center cursor" onClick={handleShow}>
        Edit
      </p>
      <MyModal show={show} handleClose={handleClose} title="Edit Profile">
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
            registerOptions={registerOptions?.bio}
          />

          <ImageUpload
            id="profileImage"
            name="profileImage"
            title="Change profile image"
            register={register}
          />

          <MyButton
            text={isSubmitting ? <ClipLoader color="#96b6c5" /> : "Update"}
            className="w-100 border-0 p-2 mt-2"
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
      </MyModal>
    </>
  );
};

export default EditProfileModal;

EditProfileModal.propTypes = {
  user: PropTypes.object,
  setData: PropTypes.any,
};
