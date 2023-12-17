import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Formfields, LoginRegister } from "../../components";
import { registerOptions } from "../../utils";
import { tryCatch } from "../../config";
import { userService } from "../../services";
import { useTitle } from "../../hooks";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { id } = useParams();
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  useTitle("Login to Pinshot");

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onFormSubmit = tryCatch(async ({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const { status, data } = await userService.resetPassword(
      id,
      token,
      password
    );
    if (status === 200) {
      toast.success(data);
      navigate("/");
    }
  });

  return (
    <LoginRegister
      onSubmit={handleSubmit(onFormSubmit)}
      isSubmitting={isSubmitting}
      title="Enter your new password"
      btnText="Reset"
    >
      <Formfields
        register={register}
        errors={errors?.password}
        registerOptions={registerOptions?.password}
        className="my-1 position-relative"
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
        errors={errors?.confirmPassword}
        registerOptions={registerOptions?.confirmPassword}
        className="my-4"
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Password"
      />
    </LoginRegister>
  );
};

export default ResetPassword;
