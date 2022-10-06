import { ToastContainer } from "react-toastify";

import Navbar from "../navbar/navbar.component";
import Footer from "../footer/footer.component";

interface ILayout {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
  return (
    <div className="min-h-screen">
      <ToastContainer theme="colored" />
      <Navbar />
      <main className="border-y dark:border-y-slate-700 min-h-[85vh]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
