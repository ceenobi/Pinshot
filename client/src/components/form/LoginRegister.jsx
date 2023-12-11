import { Container, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import MyButton from "../MyButton";
import { ClipLoader } from "react-spinners";

const LoginRegister = ({ onSubmit, title, children, isSubmitting }) => {
  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center"
    >
      <Form className="form shadow" onSubmit={onSubmit}>
        <h1
          className="fs-4 fw-bold text-center mb-4"
          style={{ color: "var(--dark100)" }}
        >
          PINSHOT
        </h1>
        <p className="mb-4 text-center">{title}</p>
        {children}
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
      </Form>
    </Container>
  );
};

export default LoginRegister;

LoginRegister.propTypes = {
  onSubmit: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  isSubmitting: PropTypes.bool,
};
