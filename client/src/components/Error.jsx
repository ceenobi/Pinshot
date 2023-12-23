import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MyButton from "./MyButton";

const Error = () => {
  const navigate = useNavigate();
  return (
    <section className="mt-5">
      <Container className="mx-auto py-5 px-4">
        <p className="mt-5">
          Oops! This hurts me more than it hurts you,
          <br />
          The page you are looking for does not exist, might have been removed,
          had its name changed, <br />
          Or is temporarily unavailable.
        </p>
        <MyButton
          className="fw-medium rounded-3 border-0"
          style={{ backgroundColor: "var(--blue200" }}
          text="Click to go home"
          onClick={() => navigate("/")}
        />
      </Container>
    </section>
  );
};

export default Error;
