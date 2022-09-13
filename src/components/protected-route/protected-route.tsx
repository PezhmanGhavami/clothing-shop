import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { UserContext } from "../../context/user.context";

function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { userState } = useContext(UserContext);
  const location = useLocation();

  if (userState.currentUser) {
    return children;
  }

  return (
    <Navigate
      state={{ from: location }}
      to="/login"
      replace
    />
  );
}

export default ProtectedRoute;
