import { Outlet } from "react-router-dom";

import Navbar from "../navbar/navbar.component";
import Footer from "../footer/footer.component";

const Layout = () => {
  return (
    <div className="h-screen bg-slate-900  text-slate-100">
      <Navbar />
      <main className="border-y border-y-slate-700 h-3/4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
