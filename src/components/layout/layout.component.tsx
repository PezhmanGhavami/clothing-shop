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
        className="text-blue-600 hover:underline dark:text-blue-300"
        href="https://github.com/PezhmanGhavami/clothing-shop"
        target="_blank"
        rel="noreferrer"
      >
        https://github.com/PezhmanGhavami/clothing-shop
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
    <div className="flex min-h-screen flex-col">
      <ToastContainer />
      <Navbar />
      <main className="h-full grow border-y dark:border-y-slate-700">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
