import { useLocation, useOutlet, useParams } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import PropTypes from "prop-types";
import Header from "../components/nav/Header";
import Sidebar from "../components/nav/Sidebar";
import Footer from "../components/Footer";

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
    <div>
      {!matchPaths.includes(location.pathname) && <Sidebar />}
      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          nodeRef={nodeRef}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <main ref={nodeRef} className="min-vh-100 mainOutlet">
            {!matchPaths.includes(location.pathname) && <Header />}
            {currentOutlet}
          </main>
        </CSSTransition>
      </SwitchTransition>
      {!matchPaths.includes(location.pathname) && <Footer />}
    </div>
  );
};

export default Root;

Root.propTypes = {
  routes: PropTypes.array,
};
