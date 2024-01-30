import { Container, Form, Image } from "react-bootstrap";
import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";
import { useAuthContext } from "@hooks";
import { Link } from "react-router-dom";
import MyButton from "../../components/MyButton";

const LoginRegister = ({
  onSubmit,
  title,
  children,
  isSubmitting,
  btnText,
  to,
  path,
  info,
}) => {
  const { isDark } = useAuthContext();
  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center backdrop"
    >
      <Form
        className={`form shadow-lg ${
          isDark ? "bg-dark" : "bg-light"
        } bg-opacity-75`}
        onSubmit={onSubmit}
      >
        <div className="z-3">
          <div className="text-center mb-4">
            <Image
              src={
                "https://res.cloudinary.com/ceenobi/image/upload/v1706179614/pintube/Frame_16_ecr4pq.svg"
              }
              style={{ width: "130px", height: "fit-content" }}
              alt="logo"
            />
          </div>
          <p className="mb-4 text-center text-uppercase fw-bold fs-4">
            {title}
          </p>
          {children}
          <MyButton
            text={isSubmitting ? <ClipLoader color="#ffffff" /> : btnText}
            className="w-100 border-0 p-2 my-2 fw-medium btn-style"
            size="lg"
            type="submit"
            variant="none"
            style={{
              backgroundColor: "var(--orange100)",
              color: "var(--color-Light)",
              height: "50px",
            }}
            disabled={isSubmitting}
          />
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-medium">{info}</span>
            <div
              style={{
                color: "var(--orange100)",
                fontWeight: 500,
              }}
            >
              <Link to={to}>{path}</Link>
            </div>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default LoginRegister;

LoginRegister.propTypes = {
  onSubmit: PropTypes.func,
  title: PropTypes.string,
  btnText: PropTypes.string,
  to: PropTypes.string,
  path: PropTypes.string,
  info: PropTypes.string,
  children: PropTypes.node.isRequired,
  isSubmitting: PropTypes.bool,
};
