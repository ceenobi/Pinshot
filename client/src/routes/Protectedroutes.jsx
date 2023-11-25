import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const Protectedroutes = ({ children, isAuth }) => {
  const location = useLocation();
  if (!isAuth) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }

  return children;
};

export default Protectedroutes;

Protectedroutes.propTypes = {
  children: PropTypes.node.isRequired,
  isAuth: PropTypes.any,
};
