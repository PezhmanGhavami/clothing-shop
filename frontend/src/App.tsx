import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/layout.component";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div>Home</div>} />
        <Route
          path="*"
          element={<p>There's nothing here!</p>}
        />
      </Route>
    </Routes>
  );
}

export default App;
