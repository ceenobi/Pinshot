import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Formfields, LoginRegister } from "@layouts";
import { registerOptions } from "@utils";
import { userService } from "@services";
import { tryCatch} from "@config";
import { useTitle, useAuthContext } from "@hooks";

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

  const from = location.search ? location.search.split("=")[1] : "/";

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
      title="Welcome, Login"
      btnText="Login"
      info="Don't have an account?"
      to="/register"
      path="Sign Up"
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
        showPassword={showPassword}
        togglePassword={togglePassword}
      />
      <Formfields
        register={register}
        errors={errors?.password}
        registerOptions={registerOptions?.password}
        className="my-1 position-relative text-black"
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="Password"
        showPassword={showPassword}
        togglePassword={togglePassword}
      />
      <div
        className="w-100 text-end mb-2"
        style={{
          color: "var(--orange100)",
          fontWeight: 500,
        }}
      >
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </LoginRegister>
  );
};

export default Login;
