import Link from "next/link";

interface IAuthLayout {
  children: React.ReactNode;
}

function AuthLayout({ children }: IAuthLayout) {
  return (
    <div className="flex flex-col justify-start items-center h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
      <div className="uppercase text-2xl tracking-wide font-medium pt-8 pb-6 lg:p-4">
        <Link href={"/"}>Clothing Shop</Link>
      </div>
      {children}
    </div>
  );
}

export default AuthLayout;
