import { useLocation, useOutlet, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import PropTypes from "prop-types";
import Header from "./nav/Header";
import Sidebar from "./nav/Sidebar";

const Root = ({ routes }) => {
  const { id } = useParams();
  const { token } = useParams();
  const location = useLocation();
  const currentOutlet = useOutlet();
  const paths = [
    "/login",
    "/register",
    "/forgot-password",
    `/reset-password/${id}/${token}`,
  ];
  const matchPaths = paths.map((path) => path);

  const { nodeRef } =
    routes.find((route) => route.path === location.pathname) ?? {};

  return (
    <Container fluid className="m-0 p-0">
      {!matchPaths.includes(location.pathname) && <Sidebar />}
      {!matchPaths.includes(location.pathname) && <Header />}
      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          nodeRef={nodeRef}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <main ref={nodeRef}>
            {currentOutlet}
          </main>
        </CSSTransition>
      </SwitchTransition>
    </Container>
  );
};

export default Root;

Root.propTypes = {
  routes: PropTypes.array,
};
