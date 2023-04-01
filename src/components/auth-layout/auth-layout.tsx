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
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col items-center justify-start pt-8">
          <div className="pb-6 pt-8 text-3xl font-medium uppercase tracking-wide lg:p-4">
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
