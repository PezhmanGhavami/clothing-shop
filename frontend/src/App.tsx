import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/layout.component";
import NotFound from "./pages/not-found/not-found";
import ProtectedRoute from "./components/protected-route/protected-route";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div>Home</div>} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <h1>Profile</h1>
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<div>login</div>} />
        <Route path="signup" element={<div>signup</div>} />
        <Route path="shop/*" element={<div>shop</div>} />
        <Route
          path="checkout"
          element={<div>checkout</div>}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
