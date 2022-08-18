import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/layout.component";
import ProtectedRoute from "./components/protected-route/protected-route";
import Home from "./components/home/home.component";
import NotFound from "./pages/not-found/not-found";
import Login from "./pages/login/login.component";
import SignUp from "./pages/signup/signup.component";
import Profile from "./pages/profile/profile.component";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="shop/*" element={<div>shop</div>} />
        <Route
          path="checkout"
          element={<div>checkout</div>}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
