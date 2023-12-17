import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Formfields, LoginRegister } from "../../components";
import { registerOptions } from "../../utils";
import { userService } from "../../services";
import { tryCatch, useAuthContext } from "../../config";
import { useTitle } from "../../hooks";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { userName: sessionStorage.getItem("username") || "" },
  });
  const { loggedInUser } = useAuthContext();
  useTitle("Login to Pinshot");

  const from = location.state?.from || "/";

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (loggedInUser) {
      navigate(from, { replace: true });
    }
  }, [from, loggedInUser, navigate]);

  const onFormSubmit = tryCatch(async ({ userName, password }) => {
    sessionStorage.setItem("username", userName);
    const { status, data } = await userService.login(userName, password);
    if (status === 200) {
      localStorage.setItem("usertoken", JSON.stringify(data.access_token));
      toast.success(data.msg);
      window.location.replace("/");
    }
  });

  return (
    <LoginRegister
      onSubmit={handleSubmit(onFormSubmit)}
      isSubmitting={isSubmitting}
      title="Welcome, Login to get back"
      btnText="Continue"
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
        showPassword={showPassword}
        togglePassword={togglePassword}
      />
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
      <Link
        to="/forgot-password"
        style={{
          color: "var(--dark100)",
          fontWeight: 500,
        }}
      >
        Forgot password?
      </Link>
      <p className="text-end mt-4">
        Don&apos;t have an account?{" "}
        <span>
          <Link
            to="/register"
            style={{
              color: "var(--dark100)",
              fontWeight: 500,
            }}
          >
            Register
          </Link>
        </span>
      </p>
    </LoginRegister>
  );
};

export default Login;
