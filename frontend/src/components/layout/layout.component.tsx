import { Outlet } from "react-router-dom";

import Navbar from "../navbar/navbar.component";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
