import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Formfields, LoginRegister } from "../../components";
import { registerOptions } from "../../utils";
import { useEffect, useState } from "react";
import { tryCatch, useStateContext } from "../../config";
import { userService } from "../../services";
import { useTitle } from "../../hooks";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedInUser } = useStateContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  useTitle("Create an account with Pinshot");

  const from = location.state?.from || "/";

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
      title="Welcome, Register to get started"
    >
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
        errors={errors?.password}
        registerOptions={registerOptions?.password}
        className="my-4 position-relative"
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="Password"
        showPassword={showPassword}
        togglePassword={togglePassword}
      />
      <p className="text-end mt-4">
        Have an account?{" "}
        <span>
          <Link
            to="/login"
            style={{
              color: "var(--dark100)",
              fontWeight: 500,
            }}
          >
            Login
          </Link>
        </span>
      </p>
    </LoginRegister>
  );
};

export default Register;
