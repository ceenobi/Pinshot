import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Formfields, LoginRegister } from "@layouts";
import { registerOptions } from "@utils";
import { tryCatch, useAuthContext } from "@config";
import { userService } from "@services";
import { useTitle } from "@hooks";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { loggedInUser } = useAuthContext();
  const navigate = useNavigate();
  useTitle("Forgot password");

  const from = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (loggedInUser) {
      navigate(from, { replace: true });
    }
  }, [from, loggedInUser, navigate]);

  const onFormSubmit = tryCatch(async ({ email }) => {
    const { status, data } = await userService.recoverPassword(email);
    if (status === 200) {
      toast.success(data);
    }
  });
  return (
    <LoginRegister
      onSubmit={handleSubmit(onFormSubmit)}
      isSubmitting={isSubmitting}
      title="Recover Password"
      btnText="Submit"
    >
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
    </LoginRegister>
  );
};

export default ForgotPassword;
