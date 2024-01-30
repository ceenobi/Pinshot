import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Formfields, LoginRegister } from "@layouts";
import { registerOptions } from "@utils";
import { tryCatch} from "@config";
import { userService } from "@services";
import { useTitle, useAuthContext } from "@hooks";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedInUser } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  useTitle("Create an account with Pinshot");

  const from = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (loggedInUser) {
      navigate(from, { replace: true });
    }
  }, [from, loggedInUser, navigate]);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onFormSubmit = tryCatch(async ({ userName, email, password }) => {
    const { status, data } = await userService.signup(
      userName,
      email,
      password
    );
    if (status === 201) {
      localStorage.setItem("usertoken", JSON.stringify(data.access_token));
      toast.success(data.msg);
      window.location.replace("/");
    }
  });

  return (
    <LoginRegister
      onSubmit={handleSubmit(onFormSubmit)}
      isSubmitting={isSubmitting}
      title="Welcome, Sign Up"
      btnText="Sign Up"
      info="Have an account?"
      to="/login"
      path="Login"
    >
      <Formfields
        register={register}
        errors={errors?.userName}
        registerOptions={registerOptions?.userName}
        className="my-4 text-black"
        id="userName"
        name="userName"
        label="Username"
        // autoFocus={true}
        type="text"
        placeholder="Username"
      />
      <Formfields
        register={register}
        errors={errors?.email}
        registerOptions={registerOptions?.email}
        className="my-4 text-black"
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="Email"
      />
      <Formfields
        register={register}
        errors={errors?.password}
        registerOptions={registerOptions?.password}
        className="my-3 position-relative text-black"
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="Password"
        showPassword={showPassword}
        togglePassword={togglePassword}
      />
    </LoginRegister>
  );
};

export default Register;
