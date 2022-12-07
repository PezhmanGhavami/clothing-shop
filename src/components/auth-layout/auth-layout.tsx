import Link from "next/link";
import { ToastContainer } from "react-toastify";

import Loading from "../loading/loading.component";
import Footer from "../footer/footer.component";

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
    <div className="h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
      <ToastContainer theme="colored" />
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col justify-start items-center">
          <div className="uppercase text-2xl tracking-wide font-medium pt-8 pb-6 lg:p-4">
            <Link href={"/"}>Clothing Shop</Link>
          </div>
          {children}
        </div>
        <div className="border-t dark:border-t-slate-700">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
