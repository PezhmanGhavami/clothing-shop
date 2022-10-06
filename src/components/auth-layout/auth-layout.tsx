import Link from "next/link";
import { ToastContainer } from "react-toastify";

import Loading from "../loading/loading.component";

import useUser from "../../hooks/useUser";

interface IAuthLayout {
  children: React.ReactNode;
}

function AuthLayout({ children }: IAuthLayout) {
  const { user } = useUser();

  if (!user || user.isLoggedIn) {
    return (
      <div className="mx-auto mt-96 text-3xl">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
      <ToastContainer />
      <div className="uppercase text-2xl tracking-wide font-medium pt-8 pb-6 lg:p-4">
        <Link href={"/"}>Clothing Shop</Link>
      </div>
      {children}
    </div>
  );
}

export default AuthLayout;
