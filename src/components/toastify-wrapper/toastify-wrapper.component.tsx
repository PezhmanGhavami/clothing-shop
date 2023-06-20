"use client";

import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const CustomToast = () => {
  return (
    <div>
      <p>
        This is a prototype project made for educational purposes. You can find
        the source code here:
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

const ToastifyWrapper = () => {
  useEffect(() => {
    toast.info(CustomToast, {
      autoClose: false,
    });
  }, []);

  return <ToastContainer />;
};

export default ToastifyWrapper;
