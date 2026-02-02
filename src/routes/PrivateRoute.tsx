import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth/auth.js"

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
