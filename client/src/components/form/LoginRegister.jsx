import { Container, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import MyButton from "../MyButton";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";

const LoginRegister = ({
  onSubmit,
  title,
  children,
  isSubmitting,
  btnText,
}) => {
  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center backdrop"
    >
      <Form className="form shadow" onSubmit={onSubmit}>
        <Link to="/">
          <h1
            className="fs-4 fw-bold text-center mb-4"
            style={{ color: "var(--dark100)" }}
          >
            PINSHOT
          </h1>
        </Link>
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
