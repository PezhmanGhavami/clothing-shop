import { Outlet } from "react-router-dom";

import "./layout.styles.css";

import Navbar from "../navbar/navbar.component";
import Footer from "../footer/footer.component";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
