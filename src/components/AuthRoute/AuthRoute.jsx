import { Route, Navigate } from "react-router-dom";

const AuthRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/archive" /> : <Navigate to="/login" replace />;
};

export default AuthRoute;
