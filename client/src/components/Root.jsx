import { Outlet, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./nav/Header";
import Sidebar from "./nav/Sidebar";

const Root = () => {
  const location = useLocation();
  const paths = ["/login", "/register"];
  const matchPaths = paths.map((path) => path);

  return (
    <Container fluid className="m-0 p-0">
      {!matchPaths.includes(location.pathname) && <Sidebar />}
      <main>
        {!matchPaths.includes(location.pathname) && <Header />}
        <Outlet />
      </main>
    </Container>
  );
};

export default Root;
