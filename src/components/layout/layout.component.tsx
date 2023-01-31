import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import Navbar from "../navbar/navbar.component";
import Footer from "../footer/footer.component";

interface ILayout {
  children: React.ReactNode;
}

const CustomToast = () => {
  return (
    <div>
      <p>
        This is a prototype project made for educational
        purposes. You can find the source code here:
      </p>
      <a
        className="text-blue-600 dark:text-blue-300 hover:underline"
        href="https://github.com/PejmanG/clothing-shop"
        target="_blank"
        rel="noreferrer"
      >
        https://github.com/PejmanG/clothing-shop
      </a>
    </div>
  );
};

const Layout = ({ children }: ILayout) => {
  useEffect(() => {
    toast.info(CustomToast, {
      autoClose: false,
    });
  }, []);
  return (
    <div className="min-h-screen">
      <ToastContainer />
      <Navbar />
      <main className="border-y dark:border-y-slate-700 min-h-[85vh]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
