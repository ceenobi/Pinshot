import { Outlet, useLocation, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./nav/Header";
import Sidebar from "./nav/Sidebar";

const Root = () => {
  const { id } = useParams();
  const { token } = useParams();
  const location = useLocation();
  const paths = [
    "/login",
    "/register",
    "/forgot-password",
    `/reset-password/${id}/${token}`,
  ];
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
