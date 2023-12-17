import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Formfields, LoginRegister } from "../../components";
import { registerOptions } from "../../utils";
import { tryCatch } from "../../config";
import { userService } from "../../services";
import { useTitle } from "../../hooks";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  useTitle("Login to Pinshot");

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
      title="Enter email to recover password"
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
