import { Container, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";
import { useAuthContext } from "@config";
import MyButton from "../MyButton";

const LoginRegister = ({
  onSubmit,
  title,
  children,
  isSubmitting,
  btnText,
}) => {
  const { isDark } = useAuthContext();
  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center backdrop"
    >
      <Form
        className={`form shadow-lg ${
          isDark ? "bg-dark" : "bg-secondary"
        } bg-opacity-75`}
        onSubmit={onSubmit}
      >
        <div className="z-3">
          <h1 className="fs-3 fw-bolder text-center mb-4">PINSHOT</h1>
          <p className="mb-4 text-center">{title}</p>
          {children}
          <MyButton
            text={isSubmitting ? <ClipLoader color="#96b6c5" /> : btnText}
            className="w-100 border-0 p-2 fw-medium btn-style"
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
  children: PropTypes.node.isRequired,
  isSubmitting: PropTypes.bool,
};
