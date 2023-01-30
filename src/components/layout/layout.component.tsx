import { useState, useEffect, useContext } from "react";
import {
  ToastContainer,
  toast,
  Theme,
} from "react-toastify";

import Navbar from "../navbar/navbar.component";
import Footer from "../footer/footer.component";

import { ThemeContext } from "../../context/theme.context";

interface ILayout {
  children: React.ReactNode;
}

const CustomeToast = () => {
  return (
    <div>
      <p>
        This a prototype project made for educational
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
  const [showToast, setShowToast] = useState(true);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (theme === "" || !showToast) return;
    toast.info(CustomeToast, {
      autoClose: false,
    });
    setShowToast(false);
  }, [theme, showToast]);
  return (
    <div className="min-h-screen">
      <ToastContainer
        theme={theme as Theme}
        toastStyle={{
          backgroundColor:
            theme === "dark" ? "#1e293b" : "#f5f5f5",
          color: theme === "dark" ? "#fff" : "#0f172a",
        }}
        bodyStyle={{
          backgroundColor:
            theme === "dark" ? "#1e293b" : "#f5f5f5",
        }}
      />
      <Navbar />
      <main className="border-y dark:border-y-slate-700 min-h-[85vh]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
