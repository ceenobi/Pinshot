import { Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Formfields, MyButton } from "../../components";
import { registerOptions } from "../../utils";
import { useEffect, useState } from "react";
import { userService } from "../../services";
import { tryCatch, useStateContext } from "../../config";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { loggedInUser } = useStateContext();

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
    const { status, data } = await userService.login(userName, password);
    if (status === 200) {
      localStorage.setItem("usertoken", JSON.stringify(data.access_token));
      toast.success(data.msg);
      window.location.replace("/");
    }
  });

  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center"
    >
      <Form className="form shadow" onSubmit={handleSubmit(onFormSubmit)}>
        <h1
          className="fs-4 fw-bold text-center mb-4"
          style={{ color: "var(--dark100)" }}
        >
          PINSHOT
        </h1>
        <p className="mb-4 text-center">Welcome, login to get back</p>
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
          className="my-4 position-relative"
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="Password"
          showPassword={showPassword}
          togglePassword={togglePassword}
        />
        <MyButton
          text={isSubmitting ? <ClipLoader color="#96b6c5" /> : "Continue"}
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
      </Form>
    </Container>
  );
};

export default Login;
