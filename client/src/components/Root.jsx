import { Outlet, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./nav/Header";
import Sidebar from "./nav/Sidebar";

const Root = () => {
  const location = useLocation();
  const hideComponent =
    location.pathname !== "/login" && location.pathname !== "/register";
  return (
    <Container fluid className="m-0 p-0">
      {hideComponent && <Sidebar />}
      <main>
        {hideComponent && <Header />}
        <Outlet />
      </main>
    </Container>
  );
};

export default Root;
